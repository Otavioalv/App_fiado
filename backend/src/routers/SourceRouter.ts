import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ValidateDatasUserController } from "../../controller/ValidateDatasUserController";


module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    
    router.post("/validateCEP", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ValidateDatasUserController().validateAdressCep(req, res);
    });
}