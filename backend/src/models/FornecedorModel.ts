import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import connection from "../database/connection";
import { loginInterface } from "../interfaces/loginInterface";
import { productInterface } from "../interfaces/productInterface";

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
        } finally {
            client.release();
        }
    }

    public async findByUsername(username: string): Promise<fornecedorInterface>{
        const client = await connection.connect();
        try {
            const SQL = `SELECT nome, senha, apelido, telefone, numeroimovel, logradouro, cep, nomeestabelecimento, uf, id_fornecedor, complemento, bairro from fornecedor WHERE nome = $1`;
            const result:fornecedorInterface = (await client.query(SQL, [username])).rows[0];
            
            return result;
        } catch (e) {
            throw new Error("Houve um erro ao encontrar ussuario");
        } finally {
            client.release();
        }
    }

    public async findUserById(id: number): Promise<fornecedorInterface>{ 
        const client = await connection.connect();
        try {
            const SQL = `SELECT nome, senha, apelido, telefone, numeroimovel, logradouro, cep, nomeestabelecimento, uf, id_fornecedor, complemento, bairro FROM fornecedor WHERE id_fornecedor = $1`;
            const result:fornecedorInterface = (await client.query(SQL, [id])).rows[0];
            
            return result;
        } catch(e) {
            throw new Error("Erro ao encontrar usuario");
        }
    }

    public async getPasswordUsingUser(datasLogin: loginInterface): Promise<string>{
        const client = await connection.connect();
        try {
            const SQL = `SELECT senha from fornecedor WHERE nome = $1`;
            const result = await client.query(SQL, [datasLogin.nome]);
            const hashedPass:string = result.rows[0]?.senha;

            return hashedPass;
        } catch (e) {
            console.log(e);
            throw new Error("Houve um erro interno ao verificar senha");
        } finally {
            client.release()
        }
    }

    public async addProducts(products: productInterface[]) {
        const client = await connection.connect();
        try {
            const numColsProds = 3;

            // Construção da query multipla 
            const sqlValues = products.map((_, index) => 
                `($${index * numColsProds + 1}, $${index * numColsProds + 2}, $${index * numColsProds + 3})`
            ).join(', ');
            
            const SQL = `INSERT INTO produto (nome, preco, disponivel) VALUES ${sqlValues};`
            const values = products.flatMap(product => [product.nome, product.preco, product.disponivel]);

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
}

export {FornecedorModel};
