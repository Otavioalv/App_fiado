import { FastifyInstance } from "fastify";
import { NotifierBroadcastParams, NotifierToUserParams, Notify, NotifyReturn } from "../../shared/interfaces/notifierInterfaces";


export const notify:Notify = (app: FastifyInstance):NotifyReturn => ({
    toUser({toId, event, payload}: NotifierToUserParams) {
        app.io.to(toId).emit(event, payload);
    },
    broadcast({event, payload}: NotifierBroadcastParams) {
        app.io.emit(event, payload);
    }
});

