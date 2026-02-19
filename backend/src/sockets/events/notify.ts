import { FastifyInstance } from "fastify";
import { NotifierBroadcastParams, NotifierToUserParams, Notify, NotifyReturn } from "../../shared/interfaces/notifierInterfaces";


export const notify:Notify = (app: FastifyInstance):NotifyReturn => ({
    toUser({toId, event, userType, payload}: NotifierToUserParams) {
        const room = `${userType}:${toId}`;
        console.log("[TO USER]: room: ", room);
        app.io.to(room).emit(event, payload);
    },
    broadcast({event, payload}: NotifierBroadcastParams) {
        app.io.emit(event, payload);
    }
});

/* 
toUser({ toId, userType, event, payload }) {
  const room = `${userType}:${toId}`;
  app.io.to(room).emit(event, payload);
}

*/

