import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import {Server as SocketIOServer } from "socket.io";
import fastifyStatic from '@fastify/static';
import { routers } from "./router";
import cors from '@fastify/cors';
import { socketIO } from "./sockets/socketIO";
import path from "path";
import { notify } from "./sockets/events/notify";
import { NotifierBroadcastParams, NotifierToUserParams } from "./shared/interfaces/notifierInterfaces";
import { NotificationService } from "./services/notification.service";


declare module 'fastify' {
    interface FastifyInstance {
        notifier: {
            toUser: ({toId, event, payload}: NotifierToUserParams) => void,
            broadcast: ({event, payload}: NotifierBroadcastParams) => void
        },
        notificationService: NotificationService
    }
}


export async function buildApp() {
    const app = Fastify({logger: false});

    await app.register(cors);
    
    await app.register(fastifySocketIO);
    await socketIO(app);

    const notifier = notify(app);
    app.decorate("notifier", notifier);
    app.decorate("notificationService", new NotificationService(app));

    await app.register(routers);
    

    app.setNotFoundHandler((req, res) => {
        res.status(404).send({
            message: "Rota nao encontrada",
            path: req.url
        })
    });

    app.setErrorHandler((err, req, res) => {
        console.log(err);
        res.status(500).send({
            message: "Erro interno no servidor"
        });
    });

    return app
}
