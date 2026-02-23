import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/cliente.controller";
import { authorizedOptions } from "../shared/utils/authenticate";
import { ClienteFornecedorController } from "../controller/clienteFornecedor.controller";
import { FornecedorController } from "../controller/fornecedor.controller";
import { ProdutoController } from "../controller/produto.controller";
import { NotificationController } from "../controller/notification.controller";


const clienteController: ClienteController = new ClienteController()
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();
const fornecedorController: FornecedorController = new FornecedorController();
const produtoController: ProdutoController = new ProdutoController();
const notificationController: NotificationController = new NotificationController()


export const clienteRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.register(req, res);
    });

    router.post("/login", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.login(req, res);
    });

    router.post("/me", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.me(req, res);
    })

    router.post("/update", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.update(req, res);
    })
    
    // INUTILIZADO
    router.post("/list-fornecedores", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.listAll(req, res);
    });

    // Teste
    router.post("/list-fornecedores-cursor", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.listAllCursor(req, res);
    });
    
    router.post("/partner", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.associarComFornecedor(req, res);
    });

    router.post("/partner/accept", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.aceitarParceriaFornecedor(req, res);
    });

    // Criar um no fornecedor
    router.post("/partner/reject", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.rejectPartner(req, res, "cliente");
    });

    router.get("/partner/list/:typeList", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res);
    }); 

    router.put("/cart", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.cartAdd(req, res);
    }); 
    
    router.post("/product/buy", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.buyProducts(req, res);
    }); 
    
    router.get("/product/list/:typeList", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.listProductsByIdFornecedor(req, res);
    }); 

    router.get('/product/buy/list/:typeList?', authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.shopList(req, res, "cliente");        
    });

    router.post("/product/cancel", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.cancelPurchaces(req, res);
    });

    router.get("/message/list/:typeList?", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.listMessages(req, res, "cliente");
    }); 

    router.post("/message/delete", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.deleteMessages(req, res, "cliente");
    });

    router.post("/message/mark-read", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.markReadMessage(req, res, "cliente");
    });

    router.post("/message/mark-all-read", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await notificationController.markAllReadMessage(req, res, "cliente");
    });

}
