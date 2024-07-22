import { PoolClient } from "pg";
import connection from "../database/connection";
import { idsFornecedorInterface } from "../interfaces/idsFornecedorInterface";
import { clienteFornecedorInterface } from "../interfaces/clienteFornecedorInterface";


class ClienteFornecedorModel {

    public async findMultPartner(ids_fornecedores: idsFornecedorInterface, id_cliente: number): Promise<clienteFornecedorInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            
            const SQL = `
                SELECT id_cliente_fornecedor, associado, fk_cliente_id, fk_fornecedor_id from cliente_fornecedor where 
                fk_fornecedor_id = ANY($1::int[]) AND fk_cliente_id = $2;
            `;

            const values = [`{${ids_fornecedores.ids.join(',')}}`, id_cliente];
            const listPartner = (await client.query(SQL, values)).rows as clienteFornecedorInterface[];

            return listPartner;

        } catch(e) {
            console.log(e);
            throw new Error("Erro ao listar associações");
        } finally {
            client?.release();
        }
    }

    public async associarComFornecedor(ids: idsFornecedorInterface, id_cliente: number): Promise<void>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();
            const sqlValues = await this.createSqlValuesPartner(ids);

            const SQL = `
                INSERT INTO 
                    cliente_fornecedor (fk_fornecedor_id, fk_cliente_id)
                VALUES ${sqlValues};
            `
            const values = await this.createArrayValuesPartner(ids, id_cliente);
        
            await client.query("BEGIN");
            await client.query(SQL, values);
            await client.query("COMMIT");
            
        } catch(e) {
            await client?.query("ROLLBACK");
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    private async createSqlValuesPartner(ids: idsFornecedorInterface): Promise<string>{
        const numcols = 2;
        
        const strSqlValues: string = ids.ids.map((_, i) => 
            `($${i * numcols + 1}, $${i * numcols + 2})`
        ).join(', ');

        return strSqlValues;
    }
    
    private async createArrayValuesPartner(ids: idsFornecedorInterface, id_cliente: number): Promise<number[]>{
        const arr:number[] = ids.ids.reduce((acc, id) => {
            acc.push(id, id_cliente);
            return acc;
        }, [] as number[]);

        // ids.ids.forEach((_, i) => {
        //     arr.ids.splice(i * 2 + 1, 0, id_user);
        // });

        return arr;
    }
}

export {ClienteFornecedorModel}