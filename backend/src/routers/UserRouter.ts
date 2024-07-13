import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ValidateDatasUserController } from "../controller/ValidateDatasUserController";
import { authenticatedRouteOptions } from "../utils/authenticate";
import { FornecedorController } from "../controller/FornecedorController";


module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
    
    router.post("/validateCEP", async(req: FastifyRequest, res: FastifyReply) => {
        return await new ValidateDatasUserController().validateAdressCep(req, res);
    });

    router.post("/fornecedor/list-all", authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
        return await new FornecedorController().listAll(req, res);
    });
}