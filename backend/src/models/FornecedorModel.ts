import { idsPartnerInterface, fornecedorInterface } from "../interfaces/userInterfaces";
import connection from "../database/connection";
import { PoolClient } from "pg";
import { UserModel } from "../interfaces/class/UserModel";
import { queryFilter } from "../interfaces/utilsInterfeces";

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
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check
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

    public async getPartnerByIdCliente(id: number, typeList: "all" | "received" | "sent" | "accepted" = "all", filterOpt: queryFilter): Promise<fornecedorInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            var sqlOpt = "";

            if(typeList === "received")
                sqlOpt += "AND (cf.fornecedor_check = TRUE AND cf.cliente_check = FALSE)";
            else if(typeList === "sent") 
                sqlOpt += "AND (cf.cliente_check = TRUE AND cf.fornecedor_check = FALSE)";
            else if(typeList === "accepted") 
                sqlOpt = "AND cf.cliente_check = TRUE AND cf.fornecedor_check = TRUE";


            const {size, page} = filterOpt;

            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 


            console.log(id, filterOpt)

            const SQL_LIST:string = `
                SELECT 
                    f.id_fornecedor,
                    f.nome,
                    f.apelido,
                    f.telefone,
                    f.nomeestabelecimento,
                    f.numeroimovel,
                    f. logradouro,
                    f. bairro,
                    f. complemento,
                    f. cep,
                    f. uf ,
                    cf.cliente_check,
                    cf.fornecedor_check,
                    cf.created_at
                FROM 
                    fornecedor AS f
                JOIN
                    cliente_fornecedor AS cf 
                    ON 
                        f.id_fornecedor = cf.fk_fornecedor_id
                WHERE 
                    cf.fk_cliente_id = $1 ${sqlOpt}
                ORDER BY
                    cf.created_at
                LIMIT $2
                OFFSET $3;`

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) as total
                FROM 
                    fornecedor AS f
                JOIN
                    cliente_fornecedor AS cf 
                    ON 
                        f.id_fornecedor = cf.fk_fornecedor_id
                WHERE 
                    cf.fk_cliente_id = $1 ${sqlOpt};
            `;

            const result:fornecedorInterface[] = (await client.query(SQL_LIST, [id, limit, offset])).rows;  
            const {total} = (await client.query(SQL_TOTAL, [id])).rows[0] as {total: number};

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return result;
        } catch(e) {
            console.error(e);
            throw new Error("Erro ao coletar parcerias");
        } finally {
            client?.release;
        }
    }

}

export {FornecedorModel};
