import { apiConfig } from "./config";
import { buildApp } from "./app";


// const PORT:number = 8090;
// const HOST:string = "0.0.0.0";

// declare module 'fastify' {
//     interface FastifyInstance {
//         io: SocketIOServer;
//     }
// };

async function start() {
    const app = await buildApp()
    
    const {host, port} = apiConfig;

    try {
        await app.listen({port: port, host: host}, () => {
            console.log(`API rodando na url >>> http://${host}:${port}\n`);
        });
    } catch {
        process.exit(1);
    }
}

start();
