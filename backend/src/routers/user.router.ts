import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { authenticatedRouteOptions } from "../shared/utils/authenticate";


const validateDatasUser: ValidateDatasUser = new ValidateDatasUser();

export const userRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    router.post("/validate-cep", async(req: FastifyRequest, res: FastifyReply) => {
        return await validateDatasUser.validateAdressCep(req, res);
    });

    // Adicoinar autenticação, somente adm acessa
    router.get("/delay_test/:time?", async(req: FastifyRequest, res: FastifyReply) => {
        try {
            const start = performance.now()
            console.log("[Delay] Iniciando delay");
            
            const {time} = req.params as {time: string | null};
    
            await new Promise(r => setTimeout(r, time ? Number(time) : 10000));
            
            const end = performance.now();
            const duration = (end - start) / 1000;
            console.log("[Delay] Tempo em segundos: ", duration);
    
            return res.status(200).send({
                message: "Requisição solicitada com sucesso"
            });
        } catch(err){
            console.log("[Delay] Erro: ", err);
            return res.status(500).send({
                message: "Erro interno no servidor"
            });
        }
    })
}