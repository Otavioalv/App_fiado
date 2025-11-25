import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/ClienteController";
import { authorizedOptions } from "../shared/utils/authenticate";
import { ClienteFornecedorController } from "../controller/ClienteFornecedorController";
import { FornecedorController } from "../controller/FornecedorController";
import { ProdutoController } from "../controller/ProdutoController";


const clienteController: ClienteController = new ClienteController()
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();
const fornecedorController: FornecedorController = new FornecedorController();
const produtoController: ProdutoController = new ProdutoController();


export const clienteRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.register(req, res);
    });

    router.post("/login", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.login(req, res);
    });

    router.post("/list-fornecedores", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await fornecedorController.listAll(req, res);
    });
    
    router.post("/partner", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.associarComFornecedor(req, res);
    });

    router.post("/partner/accept", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.aceitarParceriaFornecedor(req, res);
    });

    router.post("/partner/list", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res, "all");
    });

    router.post("/partner/list/reseived", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res, "received");
    });
    
    router.post("/partner/list/sent", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res, "sent");
    }); 

    router.post("/partner/list/accepted", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res, "accepted");
    }); 

    router.post("/product/list/:idFornecedor", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.listProductsByIdFornecedor(req, res);
    }); 

    router.post("/product/buy", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await produtoController.buyProducts(req, res);
    }); 
}
