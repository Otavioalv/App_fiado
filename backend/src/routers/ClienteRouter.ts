import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/ClienteController";
import { authenticatedRouteOptions } from "../utils/authenticate";


module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ClienteController().register(req, res);
    });

    router.post("/login", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ClienteController().login(req, res);
    });

    router.post("/fornecedor/list-all", authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
    });

    router.post("/", async(req: FastifyRequest, res: FastifyReply) => {
    });
}