import { JsonWebTokenError, TokenExpiredError, sign, verify } from "jsonwebtoken";
import { payloadInterface } from "../interfaces/payloadInterface";
import { authJwt } from "../config";

export const generateToken = async (payload: payloadInterface):Promise<string> => {
    try {
        const token = sign(payload, authJwt.secret);
        return token;
    } catch (e) {
        throw new Error("Erro ao gerar token");
    }
}

export const getPayloadFromToken = async(token: string) => {
    try {
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