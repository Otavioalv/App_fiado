import { idsPartnerInterface, fornecedorInterface, TypesListUser } from "../shared/interfaces/userInterfaces";
import connection from "../database/connection";
import { PoolClient } from "pg";
import { UserModel } from "../shared/interfaces/class/UserModel";
import { Cursor, queryFilter } from "../shared/interfaces/utilsInterfeces";

class FornecedorModel extends UserModel<fornecedorInterface>{

    public async register(datasRegister: fornecedorInterface) { 
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `
                INSERT INTO 
                    fornecedor (
                        apelido, 
                        bairro,
                        cep, 
                        complemento, 
                        logradouro, 
                        nome, 
                        nomeEstabelecimento, 
                        numeroImovel, 
                        senha, 
                        telefone, 
                        uf
                    ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`;
            const {
                    apelido, 
                    bairro,
                    cep, 
                    complemento, 
                    logradouro, 
                    nome, 
                    nomeEstabelecimento, 
                    numeroImovel, 
                    senha, 
                    telefone, 
                    uf
                } = datasRegister;

            const VALUES = [
                apelido, 
                bairro,
                cep, 
                complemento, 
                logradouro, 
                nome, 
                nomeEstabelecimento, 
                numeroImovel, 
                senha, 
                telefone, 
                uf
            ];

            await client.query('BEGIN');
            await client.query(SQL, VALUES);
            await client.query('COMMIT');
            
        } catch(e){
            console.error(e);
            await client?.query('ROLLBACK');
            throw new Error("Erro ao salvar usuario no banco de dados");
        } finally {
            client?.release();
        }
    }

    public async findByUsername(nome: string): Promise<fornecedorInterface>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `SELECT nome, senha, apelido, telefone, numeroimovel, logradouro, cep, nomeestabelecimento, uf, id_fornecedor, complemento, bairro from fornecedor WHERE nome = $1`;
            const result:fornecedorInterface = (await client.query(SQL, [nome])).rows[0];
            
            return result;
        } catch (e) {
            throw new Error("Houve um erro ao encontrar ussuario");
        } finally {
            client?.release();
        }
    }

    public async findUserById(id: number): Promise<fornecedorInterface>{ 
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `SELECT nome, senha, apelido, telefone, numeroimovel, logradouro, cep, nomeestabelecimento, uf, id_fornecedor, complemento, bairro FROM fornecedor WHERE id_fornecedor = $1`;
            const result:fornecedorInterface = (await client.query(SQL, [id])).rows[0];
            
            return result;
        } catch(e) {
            throw new Error("Erro ao procurar usuario");
        } finally {
            client?.release();
        }
    }

    public async findMultUsersByIds(ids: idsPartnerInterface): Promise<fornecedorInterface[]>{
        let client: PoolClient | undefined;
        try {   
            client = await connection.connect();
            const strSqlValues:string = ids.ids.map((_, i) => 
                `id_fornecedor = $${i+1}`
            ).join(' or ');
            const SQL: string = `SELECT nome, senha, apelido, telefone, numeroimovel, logradouro, cep, nomeestabelecimento, uf, id_fornecedor, complemento, bairro FROM fornecedor WHERE ${strSqlValues}`;
            const result:fornecedorInterface[] = (await client.query(SQL, ids.ids)).rows;  

            return result;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao procurar usuarios");
        } finally {
            client?.release();
        }
    }

    public async userExists(nome: string):Promise<boolean>{
        let client: PoolClient | undefined;  
        try {
            client = await connection.connect();
            const SQL = `SELECT 1 FROM fornecedor WHERE nome = $1`;
            const result = await client.query(SQL, [nome]);

            return result.rows.length > 0;
        } catch(e) {
            console.log(e);
            throw new Error("Erro ao verificar se usuario existe");
        } finally {
            client?.release();
        }
    }

    public async getPasswordUsingUser(nome: string): Promise<string>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `SELECT senha from fornecedor WHERE nome = $1`;
            const result = await client.query(SQL, [nome]);
            const hashedPass:string = result.rows[0]?.senha;

            if(!hashedPass) 
                throw new Error("Senha não encontrada");
            
            return hashedPass;
        } catch (e) {
            let message = "";
            if(e instanceof Error)
                message = e.message;
            throw new Error(`Houve um erro interno ao verificar senha. ${message}`);

        } finally {
            client?.release();
        }
    }
    
    public async listAll(idCliente: number, filterOpt:queryFilter): Promise<fornecedorInterface[]> {
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            const {page, size, search, filter} = filterOpt;

            const sqlFilterList: Record<string, string> = {
                "Nome": "f.nome",
                "Apelido": "LOWER(unaccent(f.apelido))",
                "Estabelecimento": "LOWER(unaccent(f.nomeestabelecimento))"
            };

            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 
            const searchSql: string = `%${search}%`; // para se adaptar ao filtro ILIKE
            const sqlFilter = sqlFilterList[filter]; // Se não tiver filter, por padrao pega pelo nome

            const SQL_LIST = `
                SELECT  
                    f.id_fornecedor,
                    f.nome,
                    f.apelido,
                    f.telefone,
                    f.nomeestabelecimento,
                    f.numeroimovel,
                    f.logradouro,
                    f.bairro,
                    f.complemento,
                    f.cep,
                    f.uf,
                    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check,
                    CASE 
                        WHEN cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE THEN 'ACCEPTED'
                        WHEN cf.cliente_check = TRUE THEN 'SENT'
                        WHEN cf.fornecedor_check = TRUE THEN 'RECEIVED'
                        ELSE 'NONE'
                    END as relationship_status
                FROM 
                    fornecedor AS f
                LEFT JOIN 
                    cliente_fornecedor AS cf
                    ON 
                        f.id_fornecedor = cf.fk_fornecedor_id
                    AND 
                        cf.fk_cliente_id = $1
                WHERE 
                    f.nome ILIKE $2 OR 
                    unaccent(f.apelido) ILIKE unaccent($2) OR 
                    unaccent(f.nomeestabelecimento) ILIKE unaccent($2)
                ORDER BY
                    ${sqlFilter} ASC
                LIMIT $3 
                OFFSET $4; 
            `;

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) AS total 
                FROM 
                    fornecedor as f
                WHERE 
                    f.nome ILIKE $1 OR 
                    unaccent(f.apelido) ILIKE unaccent($1) OR
                    unaccent(f.nomeestabelecimento) ILIKE unaccent($1);
            `;

            const result = ((await client.query(SQL_LIST, [idCliente, searchSql, limit, offset])).rows) as fornecedorInterface[];
            const {total} = ((await client.query(SQL_TOTAL, [searchSql])).rows)[0] as {total:number}; 

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return result;
        } catch (e) {
            console.log(e);
            throw new Error("Erro interno no servidor");
        } finally {
            client?.release();
        }
    }  


    public async listAllCursor( idCliente: number, filterOpt: queryFilter ): Promise<{data: fornecedorInterface[]; nextCursor?: Cursor}> {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const { size, search, filter, cursor } = filterOpt;

            const sqlFilterList: Record<string, string> = {
                "Nome": "f.nome",
                "Apelido": "LOWER(unaccent(f.apelido))",
                "Estabelecimento": "LOWER(unaccent(f.nomeestabelecimento))"
            };

            const searchSql = `%${search}%`;
            const orderColumn = sqlFilterList[filter];

            const values: any[] = [idCliente, searchSql];
            let cursorWhere = "";

            if(cursor) {
                values.push(cursor.value, cursor.id);
                
                cursorWhere = `
                    AND (
                        ${orderColumn} > $3
                        OR (${orderColumn} = $3 AND f.id_fornecedor > $4)
                    )
                `;
            }

            values.push(size);

            const SQL_LIST = `
                SELECT  
                    f.id_fornecedor,
                    f.nome,
                    f.apelido,
                    f.telefone,
                    f.nomeestabelecimento,
                    f.numeroimovel,
                    f.logradouro,
                    f.bairro,
                    f.complemento,
                    f.cep,
                    f.uf,
                    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check,
                    CASE 
                    WHEN cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE THEN 'ACCEPTED'
                    WHEN cf.cliente_check = TRUE THEN 'SENT'
                    WHEN cf.fornecedor_check = TRUE THEN 'RECEIVED'
                    ELSE 'NONE'
                    END AS relationship_status
                FROM fornecedor f
                LEFT JOIN cliente_fornecedor cf
                    ON f.id_fornecedor = cf.fk_fornecedor_id
                AND cf.fk_cliente_id = $1
                WHERE (
                    f.nome ILIKE $2 OR
                    unaccent(f.apelido) ILIKE unaccent($2) OR
                    unaccent(f.nomeestabelecimento) ILIKE unaccent($2)
                )
                ${cursorWhere}
                ORDER BY ${orderColumn} ASC, f.id_fornecedor ASC
                LIMIT $${values.length};
            `;

            const rows = (await client.query(SQL_LIST, values)).rows as fornecedorInterface[];

            if (rows.length === 0) {
            return { data: [] };
            }

            const last = rows[rows.length - 1];

            return {
                data: rows,
                nextCursor: {
                    value:
                        filter === "Nome"
                            ? last.nome
                            : filter === "Apelido"
                                ? last.apelido!
                                : last.nomeEstabelecimento,
                    id: last.id_fornecedor!,
                },
            };
        } catch (e) {
            console.error(e);
            throw new Error("Erro interno no servidor");
        } finally {
            client?.release();
        }
        }


    public async getPartnerByIdCliente(
        id: number, 
        typeList: TypesListUser = "all", 
        filterOpt: queryFilter
    ): Promise<fornecedorInterface[]>{

        let client: PoolClient | undefined;

        try {
            client = await connection.connect();
            
            const {size, page, search, filter} = filterOpt;
            
            const sqlFilterList: Record<string, string> = {
                "Nome": "f.nome ASC",
                "Apelido": "LOWER(unaccent(f.apelido)) ASC",
                "Estabelecimento": "LOWER(unaccent(f.nomeestabelecimento)) ASC",
                "Data": "cf.created_at DESC"
            };
            
            const relationshipMap: Record<TypesListUser, string> = {
                all: "",
                received: "(cf.fornecedor_check = TRUE AND cf.cliente_check = FALSE)",
                sent: "(cf.cliente_check = TRUE AND cf.fornecedor_check = FALSE)",
                accepted: "(cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE)",
                none: "cf.fk_cliente_id IS NULL"
            };

            // Edição de filtros
            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 
            const searchSql: string = `%${search}%`; // para se adaptar ao filtro ILIKE
            const orderBy = sqlFilterList[filter]; // Se não tiver filter, por padrao pega pelo nome
            const relationshipCondition = relationshipMap[typeList]; // filtro relacionamento
            const whereCondition: string[] = [];


            if(relationshipCondition) {
                whereCondition.push(relationshipCondition);
            }

            // condição obrigatoria, sempre vai ter
            whereCondition.push(`
                (
                    f.nome ILIKE $2 OR 
                    unaccent(f.apelido) ILIKE unaccent($2) OR 
                    unaccent(f.nomeestabelecimento) ILIKE unaccent($2)
                )
            `);

            // junta todas as condições no where
            const whereSql = `WHERE ${whereCondition.join(" AND ")}`;


            // join compartilhado
            const fromJoinSql = `
                FROM 
                    fornecedor AS f
                LEFT JOIN
                    cliente_fornecedor AS cf 
                ON 
                    f.id_fornecedor = cf.fk_fornecedor_id
                AND 
                    cf.fk_cliente_id = $1
            `;

            const SQL_LIST:string = `
                SELECT 
                    f.id_fornecedor,
                    f.nome,
                    f.apelido,
                    f.telefone,
                    f.nomeestabelecimento,
                    f.numeroimovel,
                    f.logradouro,
                    f.bairro,
                    f.complemento,
                    f.cep,
                    f.uf,
                    cf.created_at,
                    
                    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check,
                    CASE 
                        WHEN cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE THEN 'ACCEPTED'
                        WHEN cf.cliente_check = TRUE THEN 'SENT'
                        WHEN cf.fornecedor_check = TRUE THEN 'RECEIVED'
                        ELSE 'NONE'
                    END as relationship_status
                ${fromJoinSql}
                ${whereSql}
                ORDER BY ${orderBy}
                LIMIT $3
                OFFSET $4;
            `;

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) as total
                ${fromJoinSql}
                ${whereSql};
                
            `;

            const result:fornecedorInterface[] = (
                await client.query(SQL_LIST, [id, searchSql, limit, offset])
            ).rows as fornecedorInterface[];

            const {total} = (
                await client.query(SQL_TOTAL, [id, searchSql])
            ).rows[0] as {total: number};

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return result;
        } catch(e) {
            console.error(e);
            throw new Error("Erro ao coletar parcerias");
        } finally {
            client?.release();
        }
    }

}

export {FornecedorModel};
