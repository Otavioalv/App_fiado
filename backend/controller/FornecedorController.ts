import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";

class FornecedorController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private validateDatasUserController:ValidateDatasUserController = new ValidateDatasUserController();

    public async register(req: FastifyRequest, res: FastifyReply) {
        try {            
            const datasRegister: fornecedorInterface = req.body as fornecedorInterface;
            const message = await this.validateDatasUserController.validateDatas(datasRegister);

            if(message.length) {
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            if(await this.fornecedorModel.userExists(datasRegister.telefone)) {
                res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
                return;
            }

            const result = await this.fornecedorModel.register(datasRegister);
            res.send(successResponse("Ussuario registrado com sucesso", result));
            return;
        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor", err));
        }
    }
}

export { FornecedorController };
