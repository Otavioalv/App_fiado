import { FastifyInstance } from "fastify";
import { NotificationInput, NotifierToUserParams, NotifyReturn, MessageInterface } from "../shared/interfaces/notifierInterfaces";
import { notify } from "../sockets/events/notify";
import { NotificationModel } from "../models/notification.model";

export class NotificationService {
    private app: FastifyInstance;
    private notifier:NotifyReturn;
    private notificationModel: NotificationModel = new NotificationModel();

    constructor(app: FastifyInstance) {
        this.app = app;
        this.notifier = notify(app)
    }

    public async saveAndSendPrepared(notification: NotifierToUserParams,  inputNot: NotificationInput) {
        try {
            // Salva no banco de dados a mensagem

            const saveData: MessageInterface = {
                mensagem: notification.payload.message,
                created_at: inputNot.created_at,
                from_user_id: inputNot.user.id,
                to_user_id: parseInt(inputNot.toId),
                from_user_type: inputNot.fromUserType,
                to_user_type: inputNot.toUserType,
                type: notification.payload.type,
                title_notification: notification.payload.title,
            }

            
            await this.notificationModel.saveNotification(saveData);


            console.log("Notificação: ", notification);
            console.log("===========================\n");

            this.notifier.toUser(notification);
        }catch(err) {
            console.log("saveAndSendPrepared: ", err);
            throw new Error("Erro interno no servidor"); 
        }
    }
}



