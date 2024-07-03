import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse } from "./response";
import { ValidateDatasUserController } from "../controller/ValidateDatasUserController";

export const authenticatedRouteOptions = {
    preHandler: async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const validateDatasUser = new ValidateDatasUserController();
            const token = req.headers.authorization;

            if(!token) {
                res.status(401).send(errorResponse("Token de autenticação não fornecido"));
                return; 
            }

            await validateDatasUser.verifyToken(token);
            
        } catch (e) {
            res.status(401).send(errorResponse("Você não tem autorização para acessar esse conteudo", e));
        }
    }
}