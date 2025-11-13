import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ClienteController } from "../controller/ClienteController";
import { authenticatedRouteOptions, authorizedOptions } from "../utils/authenticate";
import { ClienteFornecedorController } from "../controller/ClienteFornecedorController";


const clienteController: ClienteController = new ClienteController()
const clienteFornecedorController: ClienteFornecedorController = new ClienteFornecedorController();

// module.exports = async function routers(router: FastifyInstance, options: FastifyPluginOptions)
// export const clienteRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => 
export const clienteRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    router.post("/register", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.register(req, res);
    });

    router.post("/login", async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.login(req, res);
    });
    
    router.post("/partner", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteFornecedorController.associarComFornecedor(req, res);
    });

    router.post("/partner/list", authorizedOptions("cliente"), async(req: FastifyRequest, res: FastifyReply) => {
        return await clienteController.partnerList(req, res);
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
