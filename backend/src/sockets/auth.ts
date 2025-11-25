import { FastifyInstance } from "fastify";
import { ValidateDatasUser } from "../validators/ValidateDatasUser";
import { getPayloadFromToken } from "../utils/tokenUtils";


export const socketAuth = (app: FastifyInstance) => {
    app.io.use(async (socket, next) => {
        try {
            const validateDatasUser = new ValidateDatasUser();
            const token: string = socket.handshake.auth?.token || socket.handshake.query?.token;

            if(!token) {
                return next(new Error("Token de autenticação não fornecido"));
            }    

            await validateDatasUser.verifyFromToken(token);

            const payload = await getPayloadFromToken(token);

            // Salva id em data 
            socket.data.userId = payload.id.toString();
            
            return next();
        } catch(err) {
            console.log("Erro no auth websocket: ", err);
            return next(new Error("Acesso negado"));
        }
    });
}
