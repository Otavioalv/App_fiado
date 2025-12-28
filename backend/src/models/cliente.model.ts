import { PoolClient } from "pg";
import connection from "../database/connection";
import { clienteInterface, idsPartnerInterface } from "../shared/interfaces/userInterfaces";
import { UserModel } from "../shared/interfaces/class/UserModel";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";


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

    public async findMultUsersByIds(ids: idsPartnerInterface): Promise<clienteInterface[]>{
        let client: PoolClient | undefined;
        try {   
            client = await connection.connect();
            const strSqlValues:string = ids.ids.map((_, i) => 
                `id_cliente = $${i+1}`
            ).join(' or ');
            const SQL: string = `SELECT nome, senha, apelido, telefone, id_cliente FROM cliente WHERE ${strSqlValues}`;
            // const SQL: string = `SELECT nome, apelido, telefone, id_cliente FROM cliente WHERE ${strSqlValues}`;

            const result:clienteInterface[] = (await client.query(SQL, ids.ids)).rows;  

            return result;
        } catch (e) {
            console.log(e);
            throw new Error("Erro ao procurar usuarios");
        } finally {
            client?.release();
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

    public async listAll(idFornecedor: number, filterOpt:queryFilter): Promise<clienteInterface[]> {
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();

            const {page, size, search, filter} = filterOpt;

            const sqlFilterList: Record<string, string> = {
                "Nome": "c.nome",
                "Apelido": "LOWER(unaccent(c.apelido))",
            };

            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 
            const searchSql: string = `%${search}%`; // para se adaptar ao filtro ILIKE
            const sqlFilter = sqlFilterList[filter]; // Se não tiver filter, por padrao pega pelo nome
            
            const SQL_LIST = `
                SELECT 
                    c.id_cliente, 
                    c.nome, 
                    c.apelido, 
                    c.telefone,
                    COALESCE(cf.cliente_check, FALSE) AS cliente_check,
                    COALESCE(cf.fornecedor_check, FALSE) AS fornecedor_check
                FROM
                    cliente as c
                LEFT JOIN
                    cliente_fornecedor AS cf
                    ON
                        c.id_cliente = cf.fk_cliente_id
                    AND
                        cf.fk_fornecedor_id = $1
                WHERE
                    c.nome ILIKE $2 OR 
                    unaccent(c.apelido) ILIKE unaccent($2)
                ORDER BY 
                    ${sqlFilter} ASC
                LIMIT $3
                OFFSET $4;
            `;

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) AS total 
                FROM 
                    cliente as c
                WHERE 
                    c.nome ILIKE $1 OR 
                    unaccent(c.apelido) ILIKE unaccent($1);
            `;

            const result = ((await client.query(SQL_LIST, [idFornecedor, searchSql, limit, offset])).rows) as clienteInterface[];
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
    
    public async getPartnerByIdFornecedor(id: number, typeList: "all" | "received" | "sent" | "accepted" = "all", filterOpt:queryFilter): Promise<clienteInterface[]>{
        let client: PoolClient | undefined;
        try {
            client = await connection.connect();


            
            var sqlOpt = "";
            
            
            if(typeList === "received")
                sqlOpt = "AND (cf.cliente_check = TRUE AND cf.fornecedor_check = FALSE)";
            else if(typeList === "sent") 
                sqlOpt = "AND (cf.fornecedor_check = TRUE AND cf.cliente_check = FALSE)";
            else if(typeList === "accepted") 
                sqlOpt = "AND cf.fornecedor_check = TRUE AND cf.cliente_check = TRUE";
            
            // console.log(id, sqlOpt);

            
            
            const {size, page} = filterOpt;

            const limit:number = size; // numero de quantidades a mostrar
            const offset:number = (page - 1) * limit // Começa a partir do numero 

            const SQL_LIST:string = `
                SELECT 
                    c.id_cliente,
                    c.nome,
                    c.apelido,
                    c.telefone,
                    cf.cliente_check,
                    cf.fornecedor_check,
                    cf.created_at
                FROM 
                    cliente AS c
                JOIN 
                    cliente_fornecedor AS cf ON c.id_cliente = cf.fk_cliente_id
                WHERE 
                    cf.fk_fornecedor_id = $1 ${sqlOpt}
                ORDER BY 
                    cf.created_at DESC
                LIMIT $2
                OFFSET $3;`

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) AS total
                FROM 
                    cliente AS c
                JOIN 
                    cliente_fornecedor AS cf ON c.id_cliente = cf.fk_cliente_id
                WHERE 
                    cf.fk_fornecedor_id = $1 ${sqlOpt}
            `;

            console.log(SQL_LIST, id, typeList);

            const result:clienteInterface[] = (await client.query(SQL_LIST, [id, limit, offset])).rows;  
            const {total} = ((await client.query(SQL_TOTAL, [id])).rows)[0] as {total:number}; 


            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);

            return result;
        } catch(e) {
            console.error(e);
            throw new Error("Erro ao coletar parcerias");
        } finally {
            client?.release();
        }
    }
}

export {ClienteModel}