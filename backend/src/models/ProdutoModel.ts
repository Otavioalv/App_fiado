import { PoolClient } from "pg";
import connection from "../database/connection";
import { productInterface } from "../interfaces/productInterface";


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
            throw new Error("Erro ao adicionar produtos");
        } finally {
            client?.release();
        }
    }

    public async listProducts(id_fornecedor: number): Promise<productInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            const SQL = `
                SELECT id_produto, nome, preco, disponivel, quantidade
                FROM produto 
                WHERE fk_id_fornecedor = $1
                ORDER BY id_produto
            `;
            
            const listProducts = (await client.query(SQL, [id_fornecedor])).rows as productInterface[];

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

    private async createSqlValues(arrObjs: Record<string, any>[]): Promise<string>{
        
        // const sqlValues = products.map((_, index) => 
        //     `($${index * numColsProds + 1}, $${index * numColsProds + 2}, $${index * numColsProds + 3}, $${index * numColsProds + 4})`
        // ).join(', ');
        
        const strSqlValues: string = arrObjs.map((product, index) => {
            const numColsProd = Object.keys(product).length + 1;
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