import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/ClienteModel";


class ClienteController {
    private clienteModel: ClienteModel = new ClienteModel();
    
    public async register(req: FastifyRequest, res: FastifyReply) {
        
    }

    public async login(req: FastifyRequest, res: FastifyReply) {
        
    }
}

export {ClienteController}