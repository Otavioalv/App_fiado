import Fastify, {FastifyInstance} from "fastify";
import { Socket, Server as SocketIOServer } from "socket.io";
import fastifySocketIO from "fastify-socket.io";
import fastifyStatic from '@fastify/static';
import { routers } from "./router";
import cors from '@fastify/cors';
import { socketIO } from "./sockets/socketIO";
import path from "path";
import { apiConfig } from "./config";

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIOServer;
    }
}

const app = Fastify({logger: false});

// const PORT:number = 8090;
// const HOST:string = "0.0.0.0";

const {host, port} = apiConfig;

async function start() {
    await app.register(cors);

    // teste
    await app.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/frontend',
        index: ['index.html']
    });
    
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

    
    try {
        await app.listen({port: port, host: host}, () => {
            console.log(`API rodando na url >>> http://${host}:${port}\n`);
        })
    } catch {
        process.exit(1);
    }
}

start();