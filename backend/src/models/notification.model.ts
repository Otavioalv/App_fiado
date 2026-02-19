import { PoolClient } from "pg";
import connection from "../database/connection";
import { MessageInterface, UserType } from "../shared/interfaces/notifierInterfaces";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";
import { MessageListType } from "../shared/interfaces/productInterface";


interface GetNotificationParams {
    toUserId: number, 
    toUserType: UserType, 
    filterOpt: queryFilter,
    typeList: MessageListType,
    idMenssagem?: number,
} 

export class NotificationModel{


    public async saveNotification(dataNot: MessageInterface):Promise<void> {
        let client: PoolClient | undefined;
        
        try {
            client = await connection.connect();

            console.log("Dentro do model: ", dataNot);

            const SQL = `
                INSERT INTO mensagens (
                    mensagem, 
                    created_at, 
                    from_user_id, 
                    to_user_id, 
                    from_user_type, 
                    to_user_type,
                    type,
                    title_notification
                ) 
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;

            const {created_at, from_user_id, from_user_type, mensagem, to_user_id, to_user_type, type, title_notification} = dataNot;
            const VALUES = [mensagem, created_at, from_user_id, to_user_id, from_user_type, to_user_type, type, title_notification];


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


    public async getNotification({
        toUserId,
        toUserType,
        filterOpt,
        typeList,
        idMenssagem,
    }: GetNotificationParams): Promise<MessageInterface[]> {
        let client: PoolClient | undefined;

        try{
            client = await connection.connect();     

            const {page, size} = filterOpt;
            
            const limit: number = size;
            const offset: number = (page -1) * limit;
            
            const whereCondition: string[] = [];
            const values: (string | number)[] = [];
            let paramIndex = 1;
            // const searchSql: string = `%${search}%`;
            // const sqlFilter = sqlFilter


            const listWhereMap: Record<MessageListType, string> = {
                all: "",
                read: "read_at IS NOT NULL",
                unread: "read_at IS NULL",
            };


            const listWhere = listWhereMap[typeList];
            
            if(listWhere) whereCondition.push(listWhere);
            
            whereCondition.push(`to_user_id = $${paramIndex++} AND to_user_type = $${paramIndex++}`);
            values.push(toUserId, toUserType);

            if(idMenssagem) {
                values.push(idMenssagem);
                whereCondition.push(`id_mensagem = $${paramIndex++}`);
            }

            
            const whereSQL = whereCondition.length ? 
                `WHERE ${whereCondition.join(" AND ")}`:
                 "";
            
            const SQL_LIST = `
                SELECT id_mensagem, mensagem, created_at, from_user_id, type, read_at, title_notification
                FROM mensagens 
                ${whereSQL}
                ORDER BY 
                    (read_at IS NULL) DESC, 
                    created_at DESC
                LIMIT $${paramIndex++}
                OFFSET $${paramIndex++};
            `;
            
            
            const SQL_TOTAL = `
                SELECT 
                    COUNT(*) as total
                FROM 
                mensagens as m
                ${whereSQL};
            `;

            // console.log(values);

            const {total} = (await client.query(SQL_TOTAL, values)).rows[0] as {total: number};
            values.push(limit, offset);
            const listMsg = (await client.query(SQL_LIST, values)).rows as MessageInterface[];
            
            // console.log(values, SQL_LIST);

            filterOpt.total = Number(total);
            filterOpt.totalPages = Math.ceil(filterOpt.total / filterOpt.size);            

            return listMsg;
        }catch(err) {
            console.log("Erro ao listar notificações: ", err);
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


    public async markReadMessage(userId: number, listIds: number[]): Promise<number>{
        let client: PoolClient | undefined;
        try{
            client = await connection.connect();     

            const SQL: string = `
                UPDATE mensagens
                SET read_at = NOW()
                WHERE 
                    id_mensagem = ANY($1::int[]) AND
                    to_user_id = $2 AND 
                    read_at IS NULL;
            `;

            const values = [listIds, userId];

            const result = await client.query(SQL, values);
            return result.rowCount || 0;
        }catch(err) {
            console.log("Erro ao marcar como lida as notificações: ", err);
            throw new Error("Erro ao marcar como lida as notificações");
        }finally {
            client?.release();
        }
    }

    public async markAllReadMessage(userId: number): Promise<number>{
        let client: PoolClient | undefined;
        try{
            client = await connection.connect();     

            const SQL: string = `
                UPDATE mensagens
                SET read_at = NOW()
                WHERE to_user_id = $1
                AND read_at IS NULL;
            `;

            const values = [userId];

            const result = await client.query(SQL, values);
            return result.rowCount || 0;
        }catch(err) {
            console.log("Erro ao marcar como lida as notificações: ", err);
            throw new Error("Erro ao marcar como lida as notificações");
        }finally {
            client?.release();
        }
    }
}
