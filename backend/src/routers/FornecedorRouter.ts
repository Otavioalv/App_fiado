import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../controller/FornecedorController";
import { authenticatedRouteOptions } from "../utils/authenticate";
import { ProdutoController } from "../controller/ProdutoController";

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

    router.post('/product/add', authenticatedRouteOptions, async (req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().addProducts(req, res);
    });

    router.post('/product/list', authenticatedRouteOptions, async (req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().listProducts(req, res);
    });

    router.post('/product/update', authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().updateProtucts(req, res);
    }); 

    router.post('/product/delete', authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().deleteProduct(req, res);        
    });
}