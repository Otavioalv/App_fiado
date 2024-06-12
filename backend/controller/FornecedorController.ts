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
            }                        



            // verificar senha, remover espaços em branco e verificar se e segura
            // verificar se existe mais de um espaço no nome
            
            const result = await this.fornecedorModel.register(datasRegister);
            res.send(successResponse("Ussuario registrado com sucesso", result));
        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor"));
        }
    }
}

export { FornecedorController };