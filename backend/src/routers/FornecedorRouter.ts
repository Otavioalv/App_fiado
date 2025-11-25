import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../controller/FornecedorController";
import { authorizedOptions } from "../shared/utils/authenticate";
import { ProdutoController } from "../controller/ProdutoController";
import { ClienteFornecedorController } from "../controller/ClienteFornecedorController";
import { ClienteController } from "../controller/ClienteController";


const fornecedorController:FornecedorController = new FornecedorController();
const produtoController:ProdutoController = new ProdutoController();
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();
const clienteControler: ClienteController = new ClienteController();


export const fornecedorRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
   
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.register(req, res);
    });

    router.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.login(req, res);
    });

    router.post("/list-clientes", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteControler.listAll(req, res);
    });
    
    router.post("/partner", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.associarComCliente(req, res);
    });
    
    router.post("/partner/accept", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.aceitarParceriaCliente(req, res);
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

    router.post('/product/add', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.addProducts(req, res);
    });

    router.post('/product/list', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.listProducts(req, res);
    });

    router.post('/product/update', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.updateProduct(req, res);
    }); 

    router.post('/product/delete', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.deleteProduct(req, res);        
    });
}
