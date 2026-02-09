import { PoolClient } from "pg";
import connection from "../database/connection";
import { AllShoppingStatusType, compraInterface, ListProductWithFornecedor, productInterface, ShoppingStatusType } from "../shared/interfaces/productInterface";
import { FilterListShop, queryFilter } from "../shared/interfaces/utilsInterfeces";
import { UserType } from "../shared/interfaces/notifierInterfaces";
import { TypesListUser } from "../shared/interfaces/userInterfaces";


class ProdutoModel  {
    public async addProducts(products: productInterface[], id_fornecedor: number) {
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            const sqlValues:string = await this.createSqlValues(products);
            
            const SQL = `
                INSERT INTO 
                    produto (nome, preco, quantidade, fk_id_fornecedor) 
                    VALUES ${sqlValues};
                `

            const values = products.flatMap(product => [
                product.nome_prod, 
                product.preco, 
                product.quantidade, 
                product.fk_id_fornecedor = id_fornecedor
            ]);
            
            await client.query('BEGIN');
            await client.query(SQL, values);
            await client.query('COMMIT');
            
        } catch (e) {
            await client?.query('ROLLBACK');
            console.log(e)
            throw new Error("Erro ao adicionar produtos");
        } finally {
            client?.release();
        }
    }

    public async addCompra(compra: compraInterface[]): Promise<void>{
        let client: PoolClient | undefined;

        try {   
            client = await connection.connect();

            const sqlValues:string = await this.createSqlValues(compra, -1);

            const SQL: string = `
                INSERT INTO 
                    compra (nome_produto, quantidade, valor_unit, prazo, fk_cliente_id, fk_fornecedor_id) 
                    VALUES ${sqlValues};
            `;

            const values = compra.flatMap(c => [
                c.nome_produto, 
                c.quantidade,
                c.valor_unit,
                c.prazo,
                c.id_cliente,
                c.id_fornecedor
            ]);


            await client.query("BEGIN");
            await client.query(SQL, values);
            await client.query("COMMIT");

        }catch(e) {
            await client?.query("ROLLBACK");
            throw new Error("Erro ao adicionar compra");
        } finally {
            client?.release();
        }
    }
    

    public async listProducts(id_fornecedor: number, filterOpt:queryFilter): Promise<productInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            const {size, page, search} = filterOpt;

            const sqlSearch: string = `%${search}%`;
            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 

            const SQL_LIST = `
                SELECT id_produto, nome, preco, quantidade
                FROM produto 
                WHERE 
                    fk_id_fornecedor = $1 AND 
                    unaccent(nome) ILIKE unaccent($2)
                ORDER BY nome ASC
                LIMIT $3
                OFFSET $4;
            `;

            const SQL_TOTAL = `
                SELECT COUNT(*) as total
                FROM produto 
                WHERE 
                    fk_id_fornecedor = $1 AND 
                    unaccent(nome) ILIKE unaccent($2);
            `;
            
            const listProducts = (await client.query(SQL_LIST, [id_fornecedor, sqlSearch, limit, offset])).rows as productInterface[];
            const {total} = (await client.query(SQL_TOTAL, [id_fornecedor, sqlSearch])).rows[0] as {total: number};

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return listProducts;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao listar produtos");
        } finally {
            client?.release();
        }
    }

    public async listProductsByIdFornecedor(
        idCliente: number, 
        filterOpt:queryFilter,
        typeList: TypesListUser = "accepted",
        idFornecedor?: number,
        idProduct?: number,
    ): Promise<ListProductWithFornecedor[]>{
        
        
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const {size, page, search, filter} = filterOpt;

            const sqlFilterList: Record<string, string> = {
                "Nome do Fornecedor": "f.nome ASC",
                "Apelido": "f.apelido ASC",
                "Estabelecimento": "f.nomeestabelecimento ASC",
                "Nome do Produto": "p.nome ASC"
            };
            
            const orderBy: string = sqlFilterList[filter] ?? "f.nome ASC";

            const relationshipMap: Record<TypesListUser, string> = {
                all: "",
                received: "(cf.fornecedor_check = TRUE AND cf.cliente_check = FALSE)",
                sent: "(cf.cliente_check = TRUE AND cf.fornecedor_check = FALSE)",
                accepted: "(cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE)",
                none: "cf.fk_cliente_id IS NULL"
            }
            
            
            
            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 
            
            const whereCondition: string[] = [];
            const values: string[] & number[] = [];
            let paramIndex = 1;

            
            values.push(idCliente);


            const relationshipCondition = relationshipMap[typeList];
            if(relationshipCondition) {
                whereCondition.push(relationshipCondition);
            }

            const sqlSearch: string = `%${search}%`;
            values.push(sqlSearch);
            const searchParam = `$${++paramIndex}`;

            whereCondition.push(`
                (
                    f.nome ILIKE ${searchParam} OR 
                    unaccent(f.apelido) ILIKE unaccent(${searchParam}) OR 
                    unaccent(f.nomeestabelecimento) ILIKE unaccent(${searchParam}) OR
                    unaccent(p.nome) ILIKE unaccent(${searchParam})
                )
            `);
            
            if(idFornecedor) {  
                values.push(idFornecedor);
                whereCondition.push(`f.id_fornecedor = $${++paramIndex}`);
            }


            // console.log(idProduct, idFornecedor);

            if(idProduct) {
                values.push(idProduct);
                whereCondition.push(`p.id_produto = $${++paramIndex}`);
            }

            const whereSql = whereCondition.length ? 
            `WHERE ${whereCondition.join(" AND ")}` 
            : "";
            

            const fromJoinSql = `
                FROM 
                    produto AS p
                LEFT JOIN 
                    cliente_fornecedor AS cf
                    ON
                        p.fk_id_fornecedor = cf.fk_fornecedor_id
                    AND
                        cf.fk_cliente_id = $1
                LEFT JOIN  
                    fornecedor AS f
                    ON
                        p.fk_id_fornecedor = f.id_fornecedor
            `;


            values.push(limit, offset);

            const SQL_LIST = `
                SELECT 
                    p.id_produto,
                    p.nome AS nome_prod,
                    p.preco,
                    p.quantidade,
                    p.fk_id_fornecedor AS id_fornecedor,
                    f.nome AS nome_fornecedor,
                    f.nomeestabelecimento,
                    f.apelido,
                    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check,
                    CASE 
                        WHEN cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE THEN 'ACCEPTED'
                        WHEN cf.cliente_check = TRUE THEN 'SENT'
                        WHEN cf.fornecedor_check = TRUE THEN 'RECEIVED'
                        ELSE 'NONE'
                    END AS relationship_status
                ${fromJoinSql}
                ${whereSql}
                ORDER BY ${orderBy}
                LIMIT $${paramIndex + 1}
                OFFSET $${paramIndex + 2};
            `;

            // console.log(SQL_LIST);

            const SQL_TOTAL = `
                SELECT COUNT(*) as total
                ${fromJoinSql}
                ${whereSql};
            `;

            // console.log(SQL_LIST, values);
            
            const listProducts = (
                await client.query<ListProductWithFornecedor>(SQL_LIST, values)
            ).rows;
            
            const {total} = (
                await client.query<{total: number}>(SQL_TOTAL, values.slice(0, paramIndex))
            ).rows[0];

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return listProducts;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao listar produtos");
        } finally {
            client?.release();
        }
    }



    public async updateProtucts(products: productInterface[], id_fornecedor: number) {
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `
                UPDATE produto 
                SET 
                    (nome, preco, quantidade) = 
                    ($1, $2, $3)
                WHERE 
                    id_produto = $4 AND fk_id_fornecedor = $5
            `;
            const values = products.flatMap(product => [
                product.nome_prod, 
                product.preco,
                product.quantidade, 
                product.id_produto,
                product.fk_id_fornecedor = id_fornecedor
            ]);

            await client.query('BEGIN');
            await client.query(SQL, values);
            await client.query('COMMIT');
        } catch (e) {
            await client?.query("ROLLBACK");
            throw new Error(`Erro ao atualizar produto`);
        } finally {
            client?.release();
        }
    }

    public async getManyProducts(ids: number[], id_fornecedor: number) {
        const client = await connection.connect();
        try {
            const SQL = `
                SELECT id_produto 
                FROM produto
                WHERE fk_id_fornecedor = $1
                AND id_produto = ANY($2)
            `;

            const result = await client.query(SQL, [id_fornecedor, ids]);
            return result.rows;
        } catch(err){
            console.log("Erro ao listar produtos: ", err);
            throw new Error("Erro ao listar compra: ")
        }finally {
            client.release();
        }
    }

    public async updateManyProducts(produtos: productInterface[], id_fornecedor: number) {
        const client = await connection.connect();

        try {
            const valuesList = produtos
                .map((p, i) => 
                    `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
                )
                .join(", ");

            const values = produtos.flatMap(p => [
                p.id_produto,
                p.nome_prod,
                p.preco,
                p.quantidade
            ]);

            
            const SQL = `
                UPDATE produto AS p
                SET 
                    nome = v.nome,
                    preco = v.preco,
                    quantidade = v.quantidade
                FROM (
                    SELECT
                        CAST(v.id_produto AS INTEGER),
                        CAST(v.nome AS TEXT),
                        CAST(v.preco AS NUMERIC),
                        CAST(v.quantidade AS INTEGER)
                    FROM (
                        VALUES ${valuesList}
                    ) AS v(id_produto, nome, preco, quantidade)
                ) AS v(id_produto, nome, preco, quantidade)
                WHERE 
                    p.id_produto = v.id_produto
                    AND p.fk_id_fornecedor = $${values.length + 1};
            `;

                    
            console.log(SQL);
            await client.query("BEGIN");
            values.push(id_fornecedor);

            await client.query(SQL, values);
            await client.query("COMMIT");

        } catch (e) {
            console.log(e);
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }
    }



    public async deleteProduct(id_produto: number, id_fornecedor: number): Promise<boolean>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `
                DELETE FROM 
                    produto 
                WHERE 
                    id_produto = $1 and fk_id_fornecedor = $2
                `;
            const values = [id_produto, id_fornecedor]

            await client.query('BEGIN');
            const result = await client.query(SQL, values);
            await client.query('COMMIT');

            return (result.rowCount ?? 0) > 0;

        } catch (e) {
            await client?.query('ROLLBACK');
            throw new Error("Erro ao deletar produto");
        } finally {
            client?.release();
        }
    }

    public async deleteManyProducts(ids: number[], id_fornecedor: number): Promise<boolean> {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const params = ids.map((_, i) => `$${i + 1}`).join(", ");

            const SQL = `
                DELETE FROM produto
                WHERE id_produto IN (${params})
                AND fk_id_fornecedor = $${ids.length + 1}
            `;

            
            const values = [...ids, id_fornecedor];
            // console.log(SQL, values);

            await client.query('BEGIN');
            const result = await client.query(SQL, values);
            await client.query('COMMIT');

            return (result.rowCount ?? 0) > 0;
        } catch(e) {
            await client?.query("ROLLBACK");
            console.log("produtoModel.deleteManyProducts >>> ", e);
            throw new Error("Erro ao deletar produto");
        }
        finally {
            client?.release();
        }
    }


    public async getProductById(idProduto:number): Promise<productInterface>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `   
                SELECT id_produto, nome, preco
                FROM produto 
                WHERE 
                    id_produto = $1;
            `;

            const result = (await client.query(SQL, [idProduto])).rows[0] as productInterface;

            return result;
        } catch(e) {
            console.log("ProdutoModel >>> ", e);
            throw new Error("Erro ao listar produto(s)");
        } finally {
            client?.release();
        }
    }

    public async getProductExists(idProduto:number, idFornecedor:number): Promise<productInterface>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `   
                SELECT id_produto, nome, preco, fk_id_fornecedor
                FROM produto  
                WHERE 
                    id_produto = $1 AND fk_id_fornecedor = $2;
            `;

            const result = (await client.query(SQL, [idProduto, idFornecedor])).rows[0] as productInterface;

            return result;
        } catch(e) {
            console.log("ProdutoModel >>> ", e);
            throw new Error("Erro ao listar produto(s)");
        } finally {
            client?.release();
        }
    }

    public async getShopList(
        fromUserId: number,
        userType: UserType,
        filterOpt: queryFilter,
        listType: ShoppingStatusType,
        toUser?: string
    ): Promise<compraInterface[]> {

        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const { size, page, search, filter } = filterOpt;

            const limit = size;
            const offset = (page - 1) * limit;

            const params: any[] = [];
            params.push(fromUserId); 
            
            const statusWhereMap: Record<AllShoppingStatusType, string> = {
                CANCELED:
                    "AND cp.cancelado = TRUE",

                REFUSED:
                    "AND cp.cancelado = FALSE AND cp.aceito = FALSE",

                ANALYSIS:
                    "AND cp.cancelado = FALSE AND cp.aceito IS NULL",

                WAIT_REMOVE:
                    "AND cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.retirado = FALSE",
                
                REMOVED: 
                    "AND cp.cancelado = FALSE and cp.aceito = TRUE AND cp.retirado = TRUE",

                PAID:
                    "AND cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.quitado = TRUE",

                PENDING:
                    "AND cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.quitado = FALSE",

                ALL: ""
            };

            const statusWhere = statusWhereMap[listType] ?? "";

            let userWhere = "";

            if (toUser) {
                params.push(toUser); // $2

                userWhere =
                    userType === "cliente"
                        ? `AND cp.fk_fornecedor_id = $${params.length}`
                        : `AND cp.fk_cliente_id = $${params.length}`;
            }

            const sqlFilterList: Record<FilterListShop, string> = {
                "Mais Recente": "cp.created_at DESC",
                "Mais Antigo": "cp.created_at ASC",
                "Nome do Usuário": "usr.nome ASC",
                "Nome do Produto": "cp.nome_produto ASC",
                "Apelido": "usr.apelido ASC",
                "Nome do Estabelecimento": "usr.nomeestabelecimento ASC"
            };

            const orderBy = sqlFilterList[filter as FilterListShop] ?? "cp.created_at DESC";

            
            params.push(`%${search}%`);
            const searchIndex = params.length;

            
            let joinAndWhere = "";

            if(userType === "cliente") {
                joinAndWhere = `
                    LEFT JOIN fornecedor AS usr
                        ON usr.id_fornecedor = cp.fk_fornecedor_id
                    WHERE
                        cp.fk_cliente_id = $1
                        ${userWhere}
                        ${statusWhere}
                        AND (
                            usr.nome ILIKE $${searchIndex} OR 
                            unaccent(usr.apelido) ILIKE unaccent($${searchIndex}) OR 
                            unaccent(cp.nome_produto) ILIKE unaccent($${searchIndex}) OR
                            unaccent(usr.nomeestabelecimento) ILIKE unaccent($${searchIndex})
                        )
                `;
            }
            else if(userType === "fornecedor") {
                joinAndWhere = `
                    LEFT JOIN cliente AS usr
                        ON usr.id_cliente = cp.fk_cliente_id
                    WHERE
                        cp.fk_fornecedor_id = $1
                        ${userWhere}
                        ${statusWhere}
                        AND (
                            usr.nome ILIKE $${searchIndex} OR 
                            unaccent(usr.apelido) ILIKE unaccent($${searchIndex}) OR 
                            unaccent(cp.nome_produto) ILIKE unaccent($${searchIndex})
                        )
                `;
            }

            const SQL_LIST = `
                SELECT
                    cp.id_compra,
                    cp.nome_produto,
                    cp.quantidade,
                    cp.valor_unit,
                    cp.quitado,
                    cp.retirado,
                    cp.created_at,
                    cp.prazo,
                    cp.fk_cliente_id,
                    cp.fk_fornecedor_id,
                    cp.aceito,
                    cp.coletado_em,
                    cp.cancelado,

                    usr.nome AS nome_user,
                    usr.apelido AS apelido_user,
                    usr.telefone AS telefone_user,
                    ${userType === "cliente" ? "usr.nomeestabelecimento," : ""}

                    CASE 
                        WHEN cp.cancelado = TRUE THEN 'CANCELED'
                        WHEN cp.aceito = FALSE THEN 'REFUSED'
                        WHEN cp.aceito IS NULL THEN 'ANALYSIS'
                        WHEN cp.retirado = FALSE THEN 'WAIT_REMOVE'
                        ELSE 'REMOVED'
                    END AS shopping_status,
                    CASE    
                        WHEN cp.quitado = TRUE THEN 'PAID'
                        ELSE 'PENDING'
                    END AS payment_status

                FROM compra AS cp
                ${joinAndWhere}
                ORDER BY ${orderBy}
                LIMIT $${params.length + 1}
                OFFSET $${params.length + 2};
            `;

            
            const SQL_TOTAL = `
                SELECT COUNT(*) AS total
                FROM compra AS cp
                ${joinAndWhere};
            `;

            const { total } = (await client.query(SQL_TOTAL, params)).rows[0];

            params.push(limit, offset);

            const result = (await client.query(SQL_LIST, params)).rows as compraInterface[];

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(total / size);

            return result;

        } catch (e) {
            console.error("ProdutoModel >>>", e);
            throw new Error("Erro ao listar compra(s)");
        } finally {
            client?.release();
        }
    }


    public async getShopList2(
        fromUserId: number,
        userType: UserType,
        filterOpt: queryFilter,
        listType: ShoppingStatusType,
        toUserId?: number,
        idCompra?:number,
    ): Promise<compraInterface[]> {

        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const { size, page, search, filter } = filterOpt;

            const sqlFilterList: Record<FilterListShop, string> = {
                "Mais Recente": "cp.created_at DESC",
                "Mais Antigo": "cp.created_at ASC",
                "Nome do Usuário": "usr.nome ASC",
                "Nome do Produto": "cp.nome_produto ASC",
                "Apelido": "usr.apelido ASC",
                "Nome do Estabelecimento": "usr.nomeestabelecimento ASC"
            };

            const orderBy = sqlFilterList[filter as FilterListShop] ?? "cp.created_at DESC";

            const statusWhereMap: Record<AllShoppingStatusType, string> = {
                CANCELED:
                    "cp.cancelado = TRUE",

                REFUSED:
                    "cp.cancelado = FALSE AND cp.aceito = FALSE",

                ANALYSIS:
                    "cp.cancelado = FALSE AND cp.aceito IS NULL",

                WAIT_REMOVE:
                    "cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.retirado = FALSE",
                
                REMOVED: 
                    "cp.cancelado = FALSE and cp.aceito = TRUE AND cp.retirado = TRUE",

                PAID:
                    "cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.quitado = TRUE",

                PENDING:
                    "cp.cancelado = FALSE AND cp.aceito = TRUE AND cp.quitado = FALSE",

                ALL: ""
            };

            const limit = size;
            const offset = (page - 1) * limit;  

            const whereCondition: string[] = [];
            const values: string[] & number[] = [];
            let paramIndex = 1;

            const statusWhere = statusWhereMap[listType];
            if(statusWhere){
                whereCondition.push(statusWhere);
            };

                        
            let userWhere = userType === "cliente" ? 
                `cp.fk_cliente_id = $${paramIndex++}`: 
                `cp.fk_fornecedor_id = $${paramIndex++}`;
            
            whereCondition.push(userWhere);
            values.push(fromUserId);
            
            if(toUserId) {
                let toUserWhere = userType === "cliente" ? 
                    `cp.fk_fornecedor_id = $${paramIndex++}` : 
                    `cp.fk_cliente_id = $${paramIndex++}`;
                
                whereCondition.push(toUserWhere);
                values.push(toUserId);
            }

            if(idCompra) {
                let compraWhere = `cp.id_compra = $${paramIndex++}`;
                whereCondition.push(compraWhere);
                values.push(idCompra);
            }
            
            
            const searchParam = `$${paramIndex++}`;
            const fromUserWhere = userType === "cliente" ? 
                `
                    (
                        usr.nome ILIKE ${searchParam} OR 
                        unaccent(usr.apelido) ILIKE unaccent(${searchParam}) OR 
                        unaccent(cp.nome_produto) ILIKE unaccent(${searchParam}) OR
                        unaccent(usr.nomeestabelecimento) ILIKE unaccent(${searchParam})
                    )
                ` : 
                `
                    (
                        usr.nome ILIKE ${searchParam} OR 
                        unaccent(usr.apelido) ILIKE unaccent(${searchParam}) OR 
                        unaccent(cp.nome_produto) ILIKE unaccent(${searchParam})
                    )
                `;
            
            whereCondition.push(fromUserWhere);
            values.push(`%${search}%`);

            
            const whereSql = whereCondition.length ? 
                `WHERE ${whereCondition.join(" AND ")}` : 
                "";

            // console.log(whereCondition);
            // console.log("WHERE SQL: ", whereSql);

            let fromJoinSql = "";
            if(userType === "cliente") {
                fromJoinSql = `
                    FROM compra AS cp
                    LEFT JOIN fornecedor AS usr
                        ON usr.id_fornecedor = cp.fk_fornecedor_id
                `;
            }else if(userType === "fornecedor") {
                fromJoinSql = `
                    FROM compra AS cp
                    LEFT JOIN cliente AS usr
                        ON usr.id_cliente = cp.fk_cliente_id
                `;
            }

            const SQL_LIST = `
                SELECT
                    cp.id_compra,
                    cp.nome_produto,
                    cp.quantidade,
                    cp.valor_unit,
                    cp.quitado,
                    cp.retirado,
                    cp.created_at,
                    cp.prazo,
                    cp.fk_cliente_id,
                    cp.fk_fornecedor_id,
                    cp.aceito,
                    cp.coletado_em,
                    cp.cancelado,

                    usr.nome AS nome_user,
                    usr.apelido AS apelido_user,
                    usr.telefone AS telefone_user,
                    ${userType === "cliente" ? "usr.nomeestabelecimento," : ""}

                    CASE 
                        WHEN cp.cancelado = TRUE THEN 'CANCELED'
                        WHEN cp.aceito = FALSE THEN 'REFUSED'
                        WHEN cp.aceito IS NULL THEN 'ANALYSIS'
                        WHEN cp.retirado = FALSE THEN 'WAIT_REMOVE'
                        ELSE 'REMOVED'
                    END AS shopping_status,
                    CASE    
                        WHEN cp.quitado = TRUE THEN 'PAID'
                        ELSE 'PENDING'
                    END AS payment_status
                
                ${fromJoinSql}
                ${whereSql}
                
                ORDER BY ${orderBy}
                LIMIT $${paramIndex++}
                OFFSET $${paramIndex};
            `;

            
            const SQL_TOTAL = `
                SELECT COUNT(*) AS total
                ${fromJoinSql}
                ${whereSql};
            `;

            const { total } = (await client.query(SQL_TOTAL, values)).rows[0];
            values.push(limit, offset);
            const result = (await client.query(SQL_LIST, values)).rows as compraInterface[];

            // console.log(SQL_LIST);
            // console.log(SQL_TOTAL);
            // console.log("Values: ", values);

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(total / size);

            return result;
        } catch (e) {
            console.error("ProdutoModel >>>", e);
            throw new Error("Erro ao listar compra(s)");
        } finally {
            client?.release();
        }
    }




    public async acceptOrRefuseManyPurchaces(ids:number[], idUser:number, accept: boolean): Promise<void>{
     let client: PoolClient | undefined;

        try {
            client = await connection.connect();


            const sqlParams:string = ids.map((_, i) => 
                `$${i+1}`
            ).join(", ");

            const SQL:string = `
                UPDATE compra 
                SET aceito = ${accept}
                WHERE 
                id_compra IN (${sqlParams})
                AND fk_fornecedor_id = $${ids.length+1}
            `;

            // console.log(ids, idUser, SQL, sqlParams);

            await client.query("BEGIN");
            await client.query(SQL, [...ids, idUser]);
            await client.query("COMMIT");

        } catch (e) {
            await client?.query("ROLLBACK");
            console.log("ProdutoModel >>> ", e);
            throw new Error("Erro editar compra(s)");
        } finally {
            client?.release();
        }
    }

    public async cancelManyPurchaces(ids:number[], idUser:number): Promise<void>{
     let client: PoolClient | undefined;

        try {
            client = await connection.connect();


            const sqlParams:string = ids.map((_, i) => 
                `$${i+1}`
            ).join(", ");

            const SQL:string = `
                UPDATE compra 
                SET cancelado = True
                WHERE 
                id_compra IN (${sqlParams})
                AND fk_cliente_id = $${ids.length+1}
            `;

            // console.log(ids, idUser, SQL, sqlParams);

            await client.query("BEGIN");
            await client.query(SQL, [...ids, idUser]);
            await client.query("COMMIT");

        } catch (e) {
            await client?.query("ROLLBACK");
            console.log("ProdutoModel >>> ", e);
            throw new Error("Erro editar compra(s)");
        } finally {
            client?.release();
        }
    }

    public async getManyPurchases(ids:number[], idUser: number, userType: UserType): Promise<compraInterface[]>{
        const client = await connection.connect();

        const fkUserTypes:Record<UserType, string> = {
            cliente: "fk_cliente_id = $1",
            fornecedor: "fk_fornecedor_id = $1",
            all: "",
            system: ""
        }

        const sqlUserFk = fkUserTypes[userType];

        try {
            const SQL = `
                SELECT 
                    cp.id_compra, cp.nome_produto, cp.quantidade,
                    cp.valor_unit, cp.quitado, cp.retirado, 
                    cp.created_at, cp.prazo, cp.fk_cliente_id as id_cliente, 
                    cp.fk_fornecedor_id as id_fornecedor, cp.aceito, cp.coletado_em,
                    cp.cancelado
                FROM compra as cp
                WHERE ${sqlUserFk}
                AND id_compra = ANY($2)
            `;

            const result = (await client.query(SQL, [idUser, ids])).rows as compraInterface[];

            // console.log(result);
            return result;
        } catch(err){
            console.log("Erro ao listar compra: ", err);
            throw new Error("Erro ao listar compra: ")
        }finally {
            client.release();
        }
    }

    public async updateManyPurchaces(compras: compraInterface[], idUser: number) {
        const client = await connection.connect();

        try {
            const valuesList = compras
                .map((p, i) => 
                    `($${i*4+1}, $${i*4+2}, $${i*4+3}, $${i*4+4})`
                )
                .join(", ");

            const values = compras.flatMap(p => [
                p.id_compra,
                p.quitado,
                p.retirado,
                p.coletado_em
            ]);

            
            const SQL = `
                UPDATE compra AS c
                SET 
                    quitado = v.quitado,
                    retirado = v.retirado,
                    coletado_em = v.coletado_em
                FROM (
                    SELECT
                        CAST(v.id_compra AS INTEGER),
                        CAST(v.quitado AS BOOLEAN),
                        CAST(v.retirado AS BOOLEAN),
                        CAST(v.coletado_em AS TIMESTAMP)
                    FROM (
                        VALUES ${valuesList}
                    ) AS v(id_compra, quitado, retirado, coletado_em)
                ) AS v(id_compra, quitado, retirado, coletado_em)
                WHERE 
                    c.id_compra = v.id_compra
                    AND c.fk_fornecedor_id = $${values.length + 1};
            `;
            
            values.push(idUser);
            
            await client.query("BEGIN");
            await client.query(SQL, values);
            await client.query("COMMIT");

        } catch (e) {
            console.log("Erro ao atualizar compra: ", e);
            await client.query("ROLLBACK");
            throw e;
        } finally {
            client.release();
        }
    }

    private async createSqlValues(arrObjs: Record<string, any>[], plus:number = 1): Promise<string>{
        
        const strSqlValues: string = arrObjs.map((product, index) => {
            const numColsProd = Object.keys(product).length + plus;
            let str: string = '';
            
                for(let i = 1; i <= numColsProd; i ++) { 
                    if(i === 1)
                        str = "("

                    str = str + `$${index * numColsProd + i}`;
                    if(i < numColsProd)
                        str = str + ', '
                    else 
                        str = str + ")"
                }
                
            return str;
        }).join(', ');

        return strSqlValues;
    }
}   

export {ProdutoModel};
