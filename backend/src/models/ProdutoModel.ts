import connection from "../database/connection";
import { productInterface } from "../interfaces/productInterface";


class ProdutoModel  {
    public async addProducts(products: productInterface[], id_fornecedor: number) {
        const client = await connection.connect();
        try {
            const numColsProds = 4;

            // Construção da query multipla 
            const sqlValues = products.map((_, index) => 
                `($${index * numColsProds + 1}, $${index * numColsProds + 2}, $${index * numColsProds + 3}, $${index * numColsProds + 4})`
            ).join(', ');
            
            const SQL = `INSERT INTO produto (nome, preco, quantidade, fk_id_fornecedor) VALUES ${sqlValues};`
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
            await client.query('ROLLBACK');
            throw new Error("Erro ao adicionar produtos");
        } finally {
            client.release();
        }
    }

    public async listProducts(id_fornecedor: number) {
        
    }
}   

export {ProdutoModel};