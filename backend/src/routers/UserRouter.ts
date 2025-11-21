import { FastifyInstance, FastifyPluginOptions, FastifyReply, FastifyRequest } from "fastify";
import { ValidateDatasUser } from "../validators/ValidateDatasUser";


const validateDatasUser: ValidateDatasUser = new ValidateDatasUser();

export const userRouter = async (router: FastifyInstance, options: FastifyPluginOptions) => {
    router.post("/validate-cep", async(req: FastifyRequest, res: FastifyReply) => {
        return await validateDatasUser.validateAdressCep(req, res);
    });
}