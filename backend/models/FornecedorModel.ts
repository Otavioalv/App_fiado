import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import connection from "../database/connection";

class FornecedorModel {
    public async register(datasRegister: fornecedorInterface) { 
        const client = await connection.connect();


        try {
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

            await client.query(SQL, VALUES);

            return ["Teste deu certo Model"];
        } catch(e){
            console.error(e);
            throw new Error("Erro ao salvar usuario no banco de dados");
        } finally {
            client.release();
        }
    }

    public async userExists(nome: string):Promise<boolean>{
        const client = await connection.connect();  
        try {
            const SQL = `SELECT 1 FROM fornecedor WHERE nome = $1`;
            const result = await client.query(SQL, [nome]);

            return result.rows.length > 0;
        } catch(e) {
            console.log(e);
            throw new Error("Erro ao verificar se usuario existe");
        }
    }
}

export {FornecedorModel};