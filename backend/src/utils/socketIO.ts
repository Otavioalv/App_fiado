import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";

export const socketIO = async (app: FastifyInstance) => {
    app.ready(async (err: Error | null) => {
        if(err) {
            console.log("Erro ao conectar usuario ao socketIO/websocket");
            throw err
        };
        
        app.io.on('connection', async (socket: Socket) => {
            console.log(`user was connectes: ${socket.id}`);

            socket.on('user-room', async (data: any) => {
                console.log(data);
            });

            socket.on('disconnect', async () => {
                console.log("an user was disconnected");
            });
        });
    });
}
