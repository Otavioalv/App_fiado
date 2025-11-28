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





// NotifierClass
declare module 'fastify' {
    interface FastifyInstance {
        notifier: {
            toUser: ({toId, event, payload}: NotifierToUserParams) => void,
            broadcast: ({event, payload}: NotifierBroadcastParams) => void
        },
        notificationService: NotificationService
    }
}

// const PORT:number = 8090;
// const HOST:string = "0.0.0.0";


export async function buildApp() {
    const app = Fastify({logger: false});
    // const {host, port} = apiConfig;
    
    await app.register(cors);

    // teste (DELETAR FUTURAMENTE) ----------
    // await app.register(fastifyStatic, {
    //     root: path.join(__dirname, 'public'),
    //     prefix: '/frontend',
    //     index: ['index.html']
    // });
    // --------------------------------------
    
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
