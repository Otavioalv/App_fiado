import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ShopkeeperController } from "../../controller/ShopkeeperController";

module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    router.get("/", async(req: FastifyRequest, res: FastifyReply) => {
        return res.send({message: "Teste API"})
    })

    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ShopkeeperController().register(req, res);
    })
}