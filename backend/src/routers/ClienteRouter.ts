import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/ClienteController";
import { authenticatedRouteOptions, authenticate, authorize } from "../utils/authenticate";


module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ClienteController().register(req, res);
    });

    router.post("/login", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ClienteController().login(req, res);
    });

    router.post("/partner", { preHandler: [authenticate, authorize('cliente')] }, async(req: FastifyRequest, res: FastifyReply) => {
        return await new ClienteController().associarComFornecedor(req, res);
    });

    // Rota de teste de autorização
    router.post("/test", authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
        return await res.status(200).send("Autorizado");
    });


    router.post("/", async(req: FastifyRequest, res: FastifyReply) => {
    });
}
