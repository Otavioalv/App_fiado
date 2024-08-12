import Fastify, {FastifyInstance} from "fastify";
import { Socket, Server as SocketIOServer } from "socket.io";
import fastifySocketIO from "fastify-socket.io";
import fastifyStatic from '@fastify/static';
import { routers } from "./router";
import cors from '@fastify/cors';
import { socketIO } from "./utils/socketIO";
import path from "path";

declare module 'fastify' {
    interface FastifyInstance {
        io: SocketIOServer;
    }
}

const app = Fastify({logger: false});

app.setErrorHandler((err, req, res) => {
    res.code(404).send({
        message: err.message, // Alterar pra uma resposta normalizada
        test: 'Deu ERRO AQUI' // alterar para a resposta normalizada
    });
});

const PORT:number = 8090;
const HOST:string = "127.0.0.1"

async function start() {
    await app.register(cors);
    await app.register(routers);
    
    // socket IO
    await app.register(fastifySocketIO);
    await app.register(fastifyStatic, {
        root: path.join(__dirname, 'public'),
        prefix: '/frontend'
    });
    await socketIO(app);
    // ------
    try {
        await app.listen({port: PORT, host: HOST}, () => {
            console.log(`API rodando na url >>> http://${HOST}:${PORT}\n`);
        })
    } catch {
        process.exit(1);
    }
}

start();