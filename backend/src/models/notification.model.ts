import { PoolClient } from "pg";
import connection from "../database/connection";
import { MessageInterface, UserType } from "../shared/interfaces/notifierInterfaces";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";


export class NotificationModel{
    public async saveNotification(dataNot: MessageInterface):Promise<void> {
        let client: PoolClient | undefined;

        try {
            client = await connection.connect();

            console.log("Dentro do model: ", dataNot);

            const SQL = `INSERT INTO mensagens 
            (mensagem, created_at, 
            from_user_id, to_user_id, 
            from_user_type, to_user_type,
            type) 
            VALUES ($1, $2, $3, $4, $5, $6, $7)`;

            const {created_at, from_user_id, from_user_type, mensagem, to_user_id, to_user_type, type} = dataNot;
            const VALUES = [mensagem, created_at, from_user_id, to_user_id, from_user_type, to_user_type, type];


            await client.query("BEGIN");
            await client.query(SQL, VALUES);
            await client.query("COMMIT");

        }catch (err) {
            await client?.query("ROLLBACK");
            console.log("Erro ao salvar mensagem no banco de dados: ", err);
            throw new Error("Erro ao salvar mensagem no banco de dados");
        } finally{
            client?.release();
        }
    }

    public async getNotification(toUserId: number, toUserType: UserType, filterOpt: queryFilter): Promise<MessageInterface[]> {
        let client: PoolClient | undefined;

        try{
            client = await connection.connect();     

            const {page, size} = filterOpt;
            
            const limit: number = size;
            const offset: number = (page -1) * limit;
            // const searchSql: string = `%${search}%`;
            // const sqlFilter = sqlFilter
            
            const SQL_LIST = `
                SELECT id_mensagem, mensagem, created_at, from_user_id, type 
                FROM mensagens 
                WHERE to_user_id = $1 AND to_user_type = $2
                ORDER BY created_at DESC
                LIMIT $3
                OFFSET $4;
            `;

            console.log(SQL_LIST, [toUserId, toUserType,limit, offset]);

            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) as total
                FROM 
                    mensagens as m
                WHERE   
                    m.to_user_id = $1 AND
                    m.to_user_type = $2;
            `;

            const listMsg = (await client.query(SQL_LIST, [toUserId, toUserType,limit, offset])).rows as MessageInterface[];
            const {total} = (await client.query(SQL_TOTAL, [toUserId, toUserType])).rows[0] as {total: number};

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);            

            return listMsg;
        }catch(err) {
            // console.log("Erro ao listar notificações: ", err);
            throw new Error("Erro ao listar notificações");
        }finally {
            client?.release();
        }
    }

    public async deleteManyMessages(ids:number[], idUser:number, userType: UserType): Promise<boolean>{
        let client: PoolClient | undefined;

        try{
            client = await connection.connect();     

            const params = ids.map((_, i) => `$${i + 1}`).join(", ");

            const SQL = `
                DELETE FROM mensagens
                WHERE id_mensagem in (${params})
                AND to_user_type = $${ids.length + 1} 
                AND to_user_id = $${ids.length + 2}
            `;


            console.log(SQL);
            const values = [...ids, userType, idUser];

            await client.query('BEGIN');
            const result = await client.query(SQL, values);
            await client.query('COMMIT');


            console.log(result);

            return (result.rowCount ?? 0) > 0;
        }catch(err) {
            await client?.query('ROLLBACK');
            // console.log("Erro ao listar notificações: ", err);
            throw new Error("Erro ao listar notificações");
        }finally {
            client?.release();
        }
    }
}
