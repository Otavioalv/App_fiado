import { FastifyReply, FastifyRequest } from "fastify";
import { loginInterface } from "../loginInterface";

abstract class UserController {
    public abstract register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>;
    public abstract login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>;
    
}

export { UserController };