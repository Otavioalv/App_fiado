import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../controller/FornecedorController";
import { authenticate, authorize} from "../utils/authenticate";
import { ProdutoController } from "../controller/ProdutoController";

module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) {
   
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await new FornecedorController().register(req, res);
    });

    router.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        return await new FornecedorController().login(req, res);
    });

    router.post('/product/add', { preHandler: [authenticate, authorize('fornecedor')] }, async (req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().addProducts(req, res);
    });

    router.post('/product/list', { preHandler: [authenticate, authorize('fornecedor')] }, async (req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().listProducts(req, res);
    });

    router.post('/product/update', { preHandler: [authenticate, authorize('fornecedor')] }, async(req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().updateProtuct(req, res);
    }); 

    router.post('/product/delete', { preHandler: [authenticate, authorize('fornecedor')] }, async(req: FastifyRequest, res: FastifyReply) => {
        return await new ProdutoController().deleteProduct(req, res);        
    });
}