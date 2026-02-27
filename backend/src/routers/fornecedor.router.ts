import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { FornecedorController } from "../controller/fornecedor.controller";
import { authorizedOptions } from "../shared/utils/authenticate";
import { ProdutoController } from "../controller/produto.controller";
import { ClienteFornecedorController } from "../controller/clienteFornecedor.controller";
import { ClienteController } from "../controller/cliente.controller";
import { NotificationController } from "../controller/notification.controller";


export const fornecedorRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    
    const fornecedorController:FornecedorController = new FornecedorController();
    const produtoController:ProdutoController = new ProdutoController();
    const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();
    const clienteControler: ClienteController = new ClienteController();
    const notificationController: NotificationController = new NotificationController()

    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.register(req, res);
    });

    router.post('/login', async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.login(req, res);
    });

    router.post('/me', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.me(req, res);
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

    router.post("/partner/list/:typeList", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.partnerList(req, res);
    });

    // router.post("/partner/list/reseived", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
    //     return await fornecedorController.partnerList(req, res, "received");
    // });

    // router.post("/partner/list/sent", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
    //     return await fornecedorController.partnerList(req, res, "sent");
    // }); 

    // router.post("/partner/list/accepted", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
    //     return await fornecedorController.partnerList(req, res, "accepted");
    // }); 

    router.post('/product/add', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.addProducts(req, res);
    });

    router.post('/product/list/:typeList?', authorizedOptions("fornecedor"), async (req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.listProducts(req, res);
    });

    router.post('/product/update', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.updateProduct(req, res);
    }); 

    router.post('/product/delete', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.deleteProduct(req, res);        
    });

    router.get('/product/buy/list/:typeList?', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.shopList(req, res, "fornecedor");        
    });

    router.post('/product/accept', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.acceptOrRefucePurchaces(req, res, true);
    });

    router.post('/product/refuse', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.acceptOrRefucePurchaces(req, res, false);
    });

    router.post('/product/purchace/update', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.updatePurchaces(req, res);
    });


    router.post('/message/list', authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.listMessages(req, res, "fornecedor");        
    });

    router.post("/message/delete", authorizedOptions("fornecedor"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.deleteMessages(req, res, "fornecedor");
    });  
}
