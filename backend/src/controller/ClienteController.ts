import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface } from "../interfaces/clienteInterface";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { errorResponse, successResponse } from "../utils/response";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";
import { generateToken } from "../utils/tokenUtils";
import { UserController } from "../interfaces/class/UserController";
import { idsFornecedorInterface } from "../interfaces/idsFornecedorInterface";


class ClienteController extends UserController{
    private clienteModel: ClienteModel = new ClienteModel();
    private validateDatasUserController: ValidateDatasUserController = new ValidateDatasUserController();
    
    public async register(req: FastifyRequest, res: FastifyReply): Promise<void> {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface;
            const message = await this.validateDatasUserController.validateDatasCliente(datasRegister);
            
            if(message.length) {
                res.status(400).send(errorResponse("Dados invalidos", message));
                return;
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
            return;
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<void>{

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
            return;
        } catch (e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
            return;
        }
    }

    public async associarComFornecedor(req: FastifyRequest, res: FastifyReply): Promise<void>{
        try {
            const ids:idsFornecedorInterface = await req.body as idsFornecedorInterface;
             
            if(!ids || !ids.ids.length) {
                res.status(404).send(errorResponse("Dados invalidos"));
                return;
            }

            // verificar se o fornecedor existe
            // retornar qual o id que nao existe 
            // nao realizar a associação se pelo menos um valor estiver inccoreto
            // realizar somente se todos os valores estiverem corretos 

            await this.clienteModel.associarComFornecedor(ids);

            res.status(200).send(successResponse("Solicitações enviadas com sucesso"));
        } catch(e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    private async generateTokenUser(user: loginInterface): Promise<string>{
        try {
            const cliente = await this.clienteModel.findByUsername(user.nome);
        
            const payload: payloadInterface = {
                id: cliente.id_cliente ?? 0,
                nome: cliente.nome,
                usuario: "cliente"
            }

            const token:string = await generateToken(payload);

            return token;
        } catch (e) {
            throw e;
        }
    }
}

export {ClienteController}
