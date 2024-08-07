import { JsonWebTokenError, TokenExpiredError, sign, verify } from "jsonwebtoken";
import { payloadInterface } from "../interfaces/payloadInterface";
import { authJwt } from "../config";
import { FastifyRequest } from "fastify";

export const generateToken = async (payload: payloadInterface):Promise<string> => {
    try {
        const token = sign(payload, authJwt.secret);
        return token;
    } catch (e) {
        throw new Error("Erro ao gerar token");
    }
}

export const getPayloadFromToken = async(token: string): Promise<payloadInterface>=> {
    try {
        if(token.startsWith("Bearer ")) {
            token = token.slice(7, token.length);
        }

        const decodedToken:payloadInterface = verify(token, authJwt.secret) as payloadInterface;

        return decodedToken;
    } catch (e) {
        if(e instanceof TokenExpiredError) {
            throw new Error("token de Login expirado. Realize o login novamente");
        } else if(e instanceof JsonWebTokenError) {
            throw new Error("Token de login inválido");
        }
        throw new Error("Houve um erro deconhecido");
    }
}

export const getTokenIdFromRequest = async(req: FastifyRequest) => {
    try {
        const token: string = req.headers.authorization as string;
        const decodedToken: payloadInterface = await getPayloadFromToken(token);
        const id: number = decodedToken.id;

        return id;
    } catch (e) {
        throw e;
    }
}