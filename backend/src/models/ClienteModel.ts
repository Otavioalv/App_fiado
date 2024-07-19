import { PoolClient } from "pg";
import connection from "../database/connection";
import { clienteInterface } from "../interfaces/clienteInterface";
import { UserModel } from "../interfaces/class/UserModel";
import { idsFornecedorInterface } from "../interfaces/idsFornecedorInterface";


class ClienteModel extends UserModel<clienteInterface>{
    
    public async register(datasRegister: clienteInterface) {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            const SQL = `
                INSERT INTO cliente (nome, senha, apelido, telefone) 
                VALUES ($1, $2, $3, $4);
            `
            const {nome, senha, apelido, telefone} = datasRegister;
            const values = [nome, senha, apelido, telefone];

            await client.query('BEGIN');
            await client.query(SQL, values);
            await client.query('COMMIT');
            return;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao salvar usuario no banco de dados");
        } finally {
            client?.release();
            return;
        }
    }
    
    public async userExists(nome: string): Promise<boolean>{
        let client: PoolClient | undefined;
        
        try {
            client = await connection.connect();
            const SQL = `SELECT 1 FROM cliente WHERE nome = $1;`;
            const result = await client.query(SQL, [nome]);

            return result.rows.length > 0;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao verificar se o usuario existe");
        } finally {
            client?.release();
        }
    }

    public async findByUsername(username: string): Promise<clienteInterface>{
        let client: PoolClient | undefined;
        try {
            
            client = await connection.connect();
            const SQL = `SELECT id_cliente, nome, senha, telefone, apelido from cliente WHERE nome = $1`
            const result: clienteInterface = (await client.query(SQL, [username])).rows[0];

            return result;
        } catch (e) {
            throw new Error("Houve um erro ao procurar usuario");
        } finally {
            client?.release();
        }
    }
    
    public async findUserById(id: number): Promise<clienteInterface>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `SELECT id_cliente, nome, senha, telefone, apelido from cliente WHERE id_cliente = $1`;
            const result: clienteInterface = (await client.query(SQL, [id])).rows[0];

            return result;
        } catch (e) {
            throw new Error("Erro ao procurar usuairo");
        } finally {
            client?.release();
        }
    }

    public async getPasswordUsingUser(nome: string): Promise<string> {
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();
            const SQL = `SELECT senha from cliente WHERE nome = $1`;
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

    public async associarComFornecedor(ids: idsFornecedorInterface, id_cliente: number) {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();
            const sqlValues = await this.createSqlValuesPartner(ids);
            const SQL = `
                INSERT INTO 
                    cliente_fornecedor (fk_cliente_id, fk_fornecedor_id)
                VALUES ${sqlValues}
            `

            
            await this.test(ids);
            
            
        } catch(e) {
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


    // fazer isso 
    private async test(ids: idsFornecedorInterface){
        console.log(ids);
        const arr: number[] = [];
        console.log(0%2,1%2, 2%2, 3%2);
        ids.ids.forEach((_, i) => {
            if(i % 2) {
                arr.push(90);
            }
            
        });

        console.log(arr);
    }

}


/* 
INSERT INTO 
    cliente_fornecedor (fk_cliente_id, fk_fornecedor_id)
VALUES
    (1, 2),
    (4, 5),
    (7, 3),
    (34, 44)
*/

export {ClienteModel}