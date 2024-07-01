import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../../controller/FornecedorController";

module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    router.get("/", async(req: FastifyRequest, res: FastifyReply) => {
        return res.status(200).send({message: "Teste API"})
    });

    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await new FornecedorController().register(req, res);
    });

    router.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        return await new FornecedorController().login(req, res);
    });
}