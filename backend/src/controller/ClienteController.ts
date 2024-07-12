import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface } from "../interfaces/clienteInterface";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { errorResponse, successResponse } from "../utils/response";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";
import { generateToken } from "../utils/tokenUtils";


class ClienteController {
    private clienteModel: ClienteModel = new ClienteModel();
    private validateDatasUserController: ValidateDatasUserController = new ValidateDatasUserController();
    
    public async register(req: FastifyRequest, res: FastifyReply) {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface;
            const message = await this.validateDatasUserController.validateDatasCliente(datasRegister);
            
            if(message.length) {
                res.status(400).send(errorResponse("Dados invalidos", message));
            }

            if(await this.clienteModel.userExists(datasRegister.nome)) {
                res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
               return; 
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            await this.clienteModel.register(datasRegister);

            res.status(200).send(successResponse("Ussuario registrado com sucesso"));
            return;
        } catch(err) {
            res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply) {

        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length) {
                res.status(400).send(errorResponse("Dados invalidos", message));
                return;
            }

            if(!await this.clienteModel.userExists(datasLogin.nome)) {
                res.status(404).send(errorResponse("Usuario não existe"));
                return;
            }

            const hashedPass: string = await this.clienteModel.getPasswordUsingUser(datasLogin.nome);

            if(!await this.validateDatasUserController.comparePassword(hashedPass, datasLogin.senha)){
                res.status(401).send(errorResponse("Senha incorreta"));
                return;
            }

            const token: string = await this.generateTokenUser(datasLogin);
            res.status(200).send(successResponse("Login realizado com sucesso", {token: token}));
        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
            return;
        }
    }

    public async generateTokenUser(user: loginInterface): Promise<string>{
        const cliente = await this.clienteModel.findByUsername(user.nome);
        
        const payload: payloadInterface = {
            id: cliente.id_cliente ?? 0,
            nome: cliente.nome,
            usuario: "cliente"
        }

        const token: string = await generateToken(payload);

        return token;
    }

}

export {ClienteController}