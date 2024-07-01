import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { loginInterface } from "../interfaces/loginInterface";

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

            if(await this.fornecedorModel.userExists(datasRegister.nome)) {
                res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
                return;
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            const result = await this.fornecedorModel.register(datasRegister);
            res.status(200).send(successResponse("Ussuario registrado com sucesso", result));
            return;
        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor", err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply) {
        try {
            const datasLogin: loginInterface = req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length){
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            if(!await this.fornecedorModel.userExists(datasLogin.nome)) {
                res.status(404).send(errorResponse("Ussuario não existe"));
                return;
            }

            const hashedPass:string = await this.fornecedorModel.getPasswordUsingUser(datasLogin);

            if(!await this.validateDatasUserController.verifyPassword(hashedPass, datasLogin.senha)) {
                res.status(401).send(errorResponse("Senha incorreta"));
                return;
            }

            res.status(200).send(successResponse("Login realizado com sucesso"));
        } catch(err) {
            res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }
}

export { FornecedorController };
