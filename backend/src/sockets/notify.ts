import { FastifyInstance } from "fastify";

export const notify = (app: FastifyInstance) => ({
    toUser(userId: string, event: string, payload: any) {
        app.io.to(userId).emit(event, payload);
    },
    broadcast(event: string, payload: any) {
        app.io.emit(event, payload);
    }
});
