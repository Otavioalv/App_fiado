import { FastifyReply, FastifyRequest } from "fastify";
import { errorResponse } from "../../common/responses/api.response";
import { ValidateDatasUser } from "../validators/ValidateDatasUser";
import { getPayloadFromToken } from "./tokenUtils";
import { payloadInterface } from "../interfaces/utilsInterfeces";

declare module 'fastify' {
    interface FastifyRequest {
        user?: payloadInterface
    }
}

export const authenticate = async (req: FastifyRequest, res: FastifyReply) => {
    try {
        const validateDatasUser = new ValidateDatasUser();
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