import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import {socketToUser, userToSocket} from "./store";
import { socketAuth } from "./auth";



export const socketIO = async (app: FastifyInstance) => {
    
    // Verifica se usuario está autenticado
    socketAuth(app);

    // se usuario tiver autenticado, passa pra essa linha
    app.ready(async (err: Error | null) => {

        app.io.on('connection', async (socket: Socket) => {
            const userId:string = socket.data.userId as string;
            const userType: string = socket.data.userType as string;

            if(!userId || !userType) return;
            
            const room = `${userType}:${userId}`;
            let set = userToSocket.get(room);

            if(!set) {
                set = new Set();
                userToSocket.set(room, set);
            }
            
            set.add(socket.id);
            socketToUser.set(socket.id, room);
            
            // console.log(userToSocket, socketToUser);

            console.log("=================================");
            console.log("userToSocket: ", userToSocket);
            console.log("socketToUser: ", socketToUser);
            console.log("room: ", room);
            console.log("=================================\n");
            
            // realiza somente uma conexao, ele nao duplica nem recria se existe, de forma automatica
            socket.join(room);
            
            socket.on('disconnect', async () => {
                const userId:string = socket.data.userId as string;
                const userType: string = socket.data.userType as string;
                
                const room = `${userType}:${userId}`;

                if(userId && userType) {
                    const set = userToSocket.get(room);
                    if(set) {
                        set.delete(socket.id);
                        if(set.size === 0)
                            userToSocket.delete(room);
                    }
                }

                socketToUser.delete(socket.id);

                console.log("=================================");
                console.log("userToSocket: ", userToSocket);
                console.log("socketToUser: ", socketToUser);
                console.log("room: ", room);
                console.log("=================================\n");
            });
        });
    });
}
