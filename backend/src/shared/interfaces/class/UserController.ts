import { FastifyReply, FastifyRequest } from "fastify";

abstract class UserController {
    public abstract register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>;
    public abstract login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>;
    public abstract listAll(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>;
    public abstract partnerList(req: FastifyRequest, res: FastifyReply, typeList: "all" | "received" | "sent" | "accepted"): Promise<FastifyReply>
}

export { UserController };