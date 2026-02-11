import { PoolClient } from "pg";
import connection from "../database/connection";
import { idsPartnerInterface, clienteFornecedorInterface } from "../shared/interfaces/userInterfaces";
import { UserType } from "../shared/interfaces/notifierInterfaces";


class ClienteFornecedorModel {

    public async findMultPartner(ids_fornecedores: idsPartnerInterface, id_cliente: number): Promise<clienteFornecedorInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            
            const SQL = `
                SELECT 
                    id_cliente_fornecedor, fk_cliente_id, fk_fornecedor_id, cliente_check, 
                    fornecedor_check 
                FROM 
                    cliente_fornecedor 
                WHERE
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


    public async findMultPartnerClient(ids_clientes: idsPartnerInterface, id_fornecedor: number): Promise<clienteFornecedorInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            
            const SQL = `
                SELECT 
                    id_cliente_fornecedor, fk_cliente_id, fk_fornecedor_id, cliente_check, 
                    fornecedor_check 
                FROM 
                    cliente_fornecedor 
                WHERE 
                    fk_cliente_id = ANY($1::int[]) AND fk_fornecedor_id = $2;
            `;

            const values = [`{${ids_clientes.ids.join(',')}}`, id_fornecedor];
            const listPartner = (await client.query(SQL, values)).rows as clienteFornecedorInterface[];

            return listPartner;

        } catch(e) {
            console.log(e);
            throw new Error("Erro ao listar associações");
        } finally {
            client?.release();
        }
    }

    public async associarComFornecedor(ids: idsPartnerInterface, id_cliente: number): Promise<void>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();
            const sqlValues = await this.createSqlValuesPartner(ids);

            const SQL = `
                INSERT INTO 
                    cliente_fornecedor (fk_fornecedor_id, fk_cliente_id, cliente_check)
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

    public async associarComCliente(ids: idsPartnerInterface, id_fornecedor: number): Promise<void>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();
            const sqlValues = await this.createSqlValuesPartner(ids);

            const SQL = `
                INSERT INTO 
                    cliente_fornecedor (fk_cliente_id, fk_fornecedor_id, fornecedor_check)
                VALUES ${sqlValues};
            `
            const values = await this.createArrayValuesPartner(ids, id_fornecedor);
            
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

    public async aceitarParceriaCliente(idFornecedor: number, idCliente: number){
        let client: PoolClient | undefined;

        try {

            console.log("aceitar parceria cliente: ");
            console.log('fornecedor: ', idFornecedor);
            console.log("cliente: ", idCliente);

            client = await connection.connect();

            const SQL = `
                UPDATE 
                    cliente_fornecedor
                SET 
                    fornecedor_check = TRUE
                WHERE   
                    fk_fornecedor_id = $1 AND
                    fk_cliente_id = $2
            `

            await client.query("BEGIN");
            await client.query(SQL, [idFornecedor, idCliente]);
            await client.query("COMMIT");

        } catch(e) {
            await client?.query("ROLLBACK");
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    public async aceitarParceriaFornecedor(idCliente: number, idFornecedor: number){
        let client: PoolClient | undefined;

        try {

            // console.log(idFornecedor, idCliente);

            client = await connection.connect();

            const SQL = `
                UPDATE 
                    cliente_fornecedor
                SET 
                    cliente_check = TRUE
                WHERE   
                    fk_cliente_id = $1 AND
                    fk_fornecedor_id = $2
            `

            await client.query("BEGIN");
            await client.query(SQL, [idCliente, idFornecedor]);
            await client.query("COMMIT");

        } catch(e) {
            await client?.query("ROLLBACK");
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    public async rejectPartner(fromUserId: number, toUserId: number, userType: UserType){
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const whereSql = userType === "cliente" 
                ? `fk_cliente_id = $1 AND fk_fornecedor_id = $2` 
                : `fk_fornecedor_id = $1 AND fk_cliente_id = $2`;

            const SQL = `
                DELETE FROM cliente_fornecedor
                WHERE ${whereSql};
            `

            console.log(SQL, fromUserId, toUserId);

            await client.query("BEGIN");
            await client.query(SQL, [fromUserId, toUserId]);
            await client.query("COMMIT");

        } catch(e) {
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    public async findPartnerCliente(idCliente: number, idFornecedor: number): Promise<boolean>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `
                SELECT 1 
                FROM 
                    cliente_fornecedor 
                WHERE 
                    fk_fornecedor_id = $1 AND 
                    fk_cliente_id = $2 AND 
                    cliente_check = TRUE AND
                    fornecedor_check = FALSE;
            `;

            const result = await client.query(SQL, [idFornecedor, idCliente]);

            console.log(SQL, idCliente, idFornecedor);

            return result.rows.length > 0;
        } catch(e) {
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }


    public async findPartnerFornecedor(idFornecedor: number, idCliente: number): Promise<boolean>{
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `
                SELECT 1 
                FROM 
                    cliente_fornecedor 
                WHERE 
                    fk_cliente_id = $1 AND 
                    fk_fornecedor_id = $2 AND 
                    fornecedor_check = TRUE AND
                    cliente_check = FALSE;
            `;

            const result = await client.query(SQL, [idCliente, idFornecedor]);

            return result.rows.length > 0;
        } catch(e) {
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    public async getPartnerAccepted(idFornecedor: number, idCliente:number) {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `
                SELECT 1
                FROM 
                    cliente_fornecedor 
                WHERE 
                    (fk_cliente_id = $1 AND fk_fornecedor_id = $2) AND 
                    (fornecedor_check = TRUE AND cliente_check = TRUE);
            `;

            const result = await client.query(SQL, [idCliente, idFornecedor]);

            return result.rows.length > 0;
        } catch(e) {
            console.log(e);
            throw new Error("Erro ao efetuar associação");
        } finally {
            client?.release();
        }
    }

    private async createSqlValuesPartner(ids: idsPartnerInterface): Promise<string>{
        const numcols = 2;
        
        const strSqlValues: string = ids.ids.map((_, i) => 
            `($${i * numcols + 1}, $${i * numcols + 2}, TRUE)`
        ).join(', ');

        return strSqlValues;
    }
    
    private async createArrayValuesPartner(ids: idsPartnerInterface, id_cliente: number): Promise<number[]>{
        const arr:number[] = ids.ids.reduce((acc, id) => {
            acc.push(id, id_cliente);
            return acc;
        }, [] as number[]);

        return arr;
    }
}

export {ClienteFornecedorModel}