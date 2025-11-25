import { describe, it, before, after } from "mocha";
import { assert } from "chai";
import { io as clientIO, Socket as ClientSocket } from "socket.io-client";
import { buildApp } from "../src/app"; // AJUSTE O CAMINHO para onde está seu app.ts
import { FastifyInstance } from "fastify";

describe("SocketIO - Seu Zé", () => {
    let clientSocket: ClientSocket;
    let app: FastifyInstance;
    const PORT = 8091;
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwibm9tZSI6Im90YXZpb28iLCJ1c3VhcmlvIjoiY2xpZW50ZSIsImlhdCI6MTc2MzE0OTI2Nn0.HQQ4w4KPHdqAWCa5L9hCI6hYew2x0gyo56Nn8-KBCN8"

    before(async () => {
        app = await buildApp();
        await app.ready();
        await app.listen({ port: PORT, host: '0.0.0.0' });

        // token
        // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Miwibm9tZSI6Im90YXZpb28iLCJ1c3VhcmlvIjoiY2xpZW50ZSIsImlhdCI6MTc2MzE0OTI2Nn0.HQQ4w4KPHdqAWCa5L9hCI6hYew2x0gyo56Nn8-KBCN8
        clientSocket = clientIO(`http://localhost:${PORT}`, {
            autoConnect: true,
            auth: {
                token: token
            }
        });

        await new Promise<void>((resolve, reject) => {
            clientSocket.on("connect", () => resolve());
            clientSocket.on("connect_error", (err) => reject(err));
        });
    });


    after(async () => {
        if(clientSocket) clientSocket.disconnect();
        if(app) await app.close();
    });

    it("Emite um teste no socketIO", (done) => {
        clientSocket.emit("test");
        // assert.ok(true);
        done();
    });

    // it("Emite auth no socket com id", (done) => {
    //     clientSocket.emit("auth", {userId: '1'});
    //     new Promise(resolve => setTimeout(resolve, 100));
    //     done();
    // })

    // it("Simula 3 usuarios conectando e interagindo", async() => {
    //     const numeroDeUsuarios = 3;
    //     const clientes: any[] = [];

        
    //     for (let i = 0; i < numeroDeUsuarios; i++) {
    //         const novoCliente = clientIO(`http://localhost:${PORT}`, {
    //             autoConnect: true,
    //             forceNew: true 
    //         });

    //         clientes.push(novoCliente);
    //     }

        
    //     await Promise.all(clientes.map(socket => {
    //         return new Promise((resolve) => socket.on("connect", resolve));
    //     }));
        
    //     // await new Promise(resolve => setTimeout(resolve, 100));
        
    //     clientes.forEach((socket, index) => {
    //         console.log(`Enviando auth do Cliente ${index}`);
    //         socket.emit("auth", { userId: `${index}` });
    //     });

    //     await new Promise(resolve => setTimeout(resolve, 100));
        

    //     // assert.equal(clientes.length, 3);

    //     // 5. Limpeza: Desconecta todo mundo pra não travar o teste
    //     clientes.forEach(socket => socket.disconnect());
        
    // });
});