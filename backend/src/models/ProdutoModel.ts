import { PoolClient } from "pg";
import connection from "../database/connection";
import { compraInterface, productInterface } from "../interfaces/productInterface";
import { queryFilter } from "../interfaces/clienteFornecedorInterface";


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
                product.nome, 
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

    public async updateProtucts(products: productInterface[], id_fornecedor: number): Promise<boolean>{
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
                product.nome, 
                product.preco,
                product.quantidade, 
                product.id_produto,
                product.fk_id_fornecedor = id_fornecedor
            ]);

            await client.query('BEGIN');
            const results = await client.query(SQL, values);
            await client.query('COMMIT');
            
            // Diferença de performance insignificante em relação ao return
            // Escolhi os "!!", pois tem mais legibilidade
            return !!results.rowCount;
            // return (results.rowCount != null && results.rowCount > 0);

        } catch (e) {
            await client?.query("ROLLBACK");
            throw new Error(`Erro ao atualizar produto`);
        } finally {
            client?.release();
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

            return !!result.rowCount;

        } catch (e) {
            await client?.query('ROLLBACK');
            throw new Error("Erro ao deletar produto");
        } finally {
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

    private async createSqlValues(arrObjs: Record<string, any>[], plus:number = 1): Promise<string>{
        
        // const sqlValues = products.map((_, index) => 
        //     `($${index * numColsProds + 1}, $${index * numColsProds + 2}, $${index * numColsProds + 3}, $${index * numColsProds + 4})`
        // ).join(', ');
        
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