import cron from 'node-cron';
import connection from '../database/connection';

export function startCleanupNotificationsJob() {
    console.log("[CRON] CRON iniciado...");
    cron.schedule('0 */12 * * *', async () => {
        console.log('[CRON] Limpando notificações antigas...');

        try {
            const result = await connection.query(`
                WITH old AS (
                    SELECT id_mensagem
                    FROM mensagens
                    WHERE read_at < NOW() - INTERVAL '30 days'
                    ORDER BY read_at ASC
                    LIMIT 1000
                )
                DELETE FROM mensagens
                USING old
                WHERE mensagens.id_mensagem = old.id_mensagem;
            `);


            console.log(`[CRON] ${result.rowCount} notificações removidas`);
        } catch (err) {
            console.error('[CRON] Erro na limpeza:', err);
        }
    });
}
