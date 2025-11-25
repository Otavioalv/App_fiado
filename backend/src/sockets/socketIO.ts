import { FastifyInstance } from "fastify";
import { Socket } from "socket.io";
import {socketToUser, userToSocket} from "./store";
import { socketAuth } from "./auth";



export const socketIO = async (app: FastifyInstance) => {
    socketAuth(app);

    app.ready(async (err: Error | null) => {

        app.io.on('connection', async (socket: Socket) => {
            const userId:string = socket.data.userId as string;
            if(!userId) return;
        
            let set = userToSocket.get(userId);

            if(!set) {
                set = new Set();
                userToSocket.set(userId, set);
            }
            
            set.add(socket.id);
            socketToUser.set(socket.id, userId);
            
            // console.log(userToSocket, socketToUser);

            console.log("userToSocket: ", userToSocket);
            console.log("socketToUser: ", socketToUser);
            console.log("userId: ", userId);
            
            // realiza somente uma conexao, ele nao duplica nem recria se existe, de forma automatica
            socket.join(userId);
            
            socket.on('disconnect', async () => {
                const userId = socketToUser.get(socket.id);
                
                if(userId) {
                    const set = userToSocket.get(userId);
                    if(set) {
                        set.delete(socket.id);
                        if(set.size === 0)
                            userToSocket.delete(userId);
                    }
                }

                socketToUser.delete(socket.id);

                // console.log("Entrou: disconect");
                // console.log("userToSocket: ", userToSocket);
                // console.log("socketToUser: ", socketToUser);
            });
        });
    });
}
