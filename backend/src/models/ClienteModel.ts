import { PoolClient } from "pg";
import connection from "../database/connection";
import { clienteInterface } from "../interfaces/clienteInterface";
import { UserModel } from "../interfaces/class/UserModel";


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
            throw new Error("Houve um erro ao encontrar usuario");
        } finally {
            client?.release();
        }
    }
    
    public async findUserById(id: number): Promise<clienteInterface>{
        return {nome: "", senha: "", telefone: ""}
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

}

export {ClienteModel}