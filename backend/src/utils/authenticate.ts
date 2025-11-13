import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse } from "./response";
import { ValidateDatasUserController } from "../controller/ValidateDatasUserController";
import { getPayloadFromToken } from "./tokenUtils";
import { payloadInterface } from "../interfaces/payloadInterface";

declare module 'fastify' {
    interface FastifyRequest {
        user?: payloadInterface
    }
}

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const validateDatasUser = new ValidateDatasUserController();
        const token = req.headers.authorization;

        if(!token || !token.startsWith("Bearer ")) {
            throw new Error("Token de autenticação não fornecido");
        }

        await validateDatasUser.verifyFromToken(token);
        req.user = await getPayloadFromToken(token);
    } catch (e) {
        res.status(401).send(errorResponse("Você não tem autorização para acessar esse conteudo", e))
    }
        
}

export const authorize = (user: "fornecedor" | "cliente") => {
    return (req: FastifyRequest, res: FastifyReply, done: Function) => {
        try {
            if(req.user?.usuario !== user){
                throw new Error("Acesso negado");
            }
            
            done();   
        } catch (e) {
            res.status(401).send(errorResponse("Voce nao te autorização para acessar esse conteuto", e))
        }
    };
}

export const authenticatedRouteOptions = {
    preHandler: authenticate  
}

export const authorizedOptions = (role: "fornecedor" | "cliente") => {
    return {
        preHandler: [authenticate, authorize(role)]
    }
}