import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";

import { generateToken } from "../utils/tokenUtils";
import { UserController } from "../interfaces/class/UserController";


class FornecedorController extends UserController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private validateDatasUserController:ValidateDatasUserController = new ValidateDatasUserController();

    public async register(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {            
            const datasRegister: fornecedorInterface = await req.body as fornecedorInterface;
            const message = await this.validateDatasUserController.validateDatasFornecedor(datasRegister);
            
            if(message.length) {
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            if(await this.fornecedorModel.userExists(datasRegister.nome)) {
                res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
                return;
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            await this.fornecedorModel.register(datasRegister);

            res.status(200).send(successResponse("Ussuario registrado com sucesso"));
            return;
        } catch(err) {
            res.status(500).send(errorResponse("Erro Interno no servidor", err));
            return
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<void>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length){
                res.status(400).send(errorResponse("dados invalidos", message));
                return;
            }

            if(!await this.fornecedorModel.userExists(datasLogin.nome)) {
                res.status(404).send(errorResponse("Ussuario não existe"));
                return;
            }

            const hashedPass:string = await this.fornecedorModel.getPasswordUsingUser(datasLogin.nome);
            
            if(!await this.validateDatasUserController.comparePassword(hashedPass, datasLogin.senha)) {
                res.status(401).send(errorResponse("Senha incorreta"));
                return;
            }

            const token:string = await this.generateTokenUser(datasLogin);

            res.status(200).send(successResponse("Login realizado com sucesso", {token: token}));
            return
        } catch(err) {
            res.status(500).send(errorResponse("Erro interno no servidor", err));
            return
        }
    }   

    public async listAll(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const list:fornecedorInterface[] = await this.fornecedorModel.listAll();

            res.status(200).send(successResponse("Fornecedores listados com sucesso", {fornecedor: list}));
        } catch(e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    private async generateTokenUser(user: loginInterface): Promise<string>{
        try{
            const fornecedor = await this.fornecedorModel.findByUsername(user.nome);
        
            const payload: payloadInterface =  { 
                id: fornecedor.id_fornecedor ?? 0,
                nome: fornecedor.nome,
                usuario: "fornecedor"
            }

            const token:string = await generateToken(payload);

            return token;
        } catch(e) {
            throw e;
        }
    }
}

export { FornecedorController };
