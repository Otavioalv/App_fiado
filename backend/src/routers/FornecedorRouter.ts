import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../controller/FornecedorController";
import { authorizedOptions } from "../utils/authenticate";
import { ProdutoController } from "../controller/ProdutoController";
import { ClienteFornecedorController } from "../controller/ClienteFornecedorController";


const fornecedorController:FornecedorController = new FornecedorController();
const produtoController:ProdutoController = new ProdutoController();
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();

// module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions) 
export const fornecedorRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
   
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.register(req, res);
    });

    router.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.login(req, res);
    });
    
    router.post("/partner", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.associarComCliente(req, res);
    });

    router.post("/partner/list", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.partnerList(req, res, "all");
    });

    router.post("/partner/list/reseived", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.partnerList(req, res, "received");
    });

    router.post("/partner/list/sent", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.partnerList(req, res, "sent");
    }); 

    router.post("/partner/list/accepted", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.partnerList(req, res, "accepted");
    }); 

    router.post("/partner/accept", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.aceitarParceriaCliente(req, res);
    }); 

    router.post('/product/add', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.addProducts(req, res);
    });

    router.post('/product/list', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.listProducts(req, res);
    });

    router.post('/product/update', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.updateProtuct(req, res);
    }); 

    router.post('/product/delete', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.deleteProduct(req, res);        
    });
}