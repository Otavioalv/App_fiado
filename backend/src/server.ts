import Fastify from "fastify";
import { routers } from "./router";
import cors from '@fastify/cors';

const app = Fastify({logger: false});

app.setErrorHandler((err, req, res) => {
    res.code(404).send({
        message: err.message,
        test: 'Deu ERRO AQUI'
    });
});

const PORT:number = 8090;

async function start() {
    await app.register(cors);
    await app.register(routers);

    try {
        await app.listen({port: PORT}, () => {
            console.log(`API rodando na url >>> http://localhost:${PORT}\n`);
        })
    } catch {
        process.exit(1);
    }
}

start();