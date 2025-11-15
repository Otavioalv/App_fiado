import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/ClienteController";
import { authenticatedRouteOptions, authorizedOptions } from "../utils/authenticate";
import { ClienteFornecedorController } from "../controller/ClienteFornecedorController";
import { FornecedorController } from "../controller/FornecedorController";


const clienteController: ClienteController = new ClienteController()
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();
const fornecedorController: FornecedorController = new FornecedorController();

// module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions)
// export const clienteRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => 
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

    // Rota de teste de autorização
    router.post("/test", authenticatedRouteOptions, async(req: FastifyRequest, res: FastifyReply) => {
        return await res.status(200).send({
            message: "Autorizado"
        });
    });


    router.post("/", async(req: FastifyRequest, res: FastifyReply) => {
    });
}
