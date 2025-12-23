import { apiConfig } from "./config";
import { buildApp } from "./app";


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
