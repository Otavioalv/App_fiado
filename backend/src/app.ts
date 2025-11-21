import Fastify from "fastify";
import fastifySocketIO from "fastify-socket.io";
import {Server as SocketIOServer } from "socket.io";
import fastifyStatic from '@fastify/static';
import { routers } from "./router";
import cors from '@fastify/cors';
import { socketIO } from "./sockets/socketIO";
import path from "path";

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIOServer;
    }
}

// const PORT:number = 8090;
// const HOST:string = "0.0.0.0";


export async function buildApp() {
    const app = Fastify({logger: false});
    // const {host, port} = apiConfig;
    
    await app.register(cors);

    // teste (DELETAR FUTURAMENTE) ----------
    await app.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/frontend',
        index: ['index.html']
    });
    // --------------------------------------
    
    await app.register(routers);
    await app.register(fastifySocketIO);
    await socketIO(app);
    
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
