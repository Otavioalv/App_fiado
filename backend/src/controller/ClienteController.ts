import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface } from "../interfaces/clienteInterface";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { errorResponse, successResponse } from "../utils/response";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";
import { generateToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { UserController } from "../interfaces/class/UserController";
import { idsPartnerInterface } from "../interfaces/idsFornecedorInterface";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";


class ClienteController extends UserController{
    private clienteModel: ClienteModel = new ClienteModel();
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private validateDatasUserController: ValidateDatasUserController = new ValidateDatasUserController();
    
    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface;

            const message = await this.validateDatasUserController.validateDatasCliente(datasRegister);
            
            if(message.length) {
                return res.status(400).send(errorResponse("Dados invalidos", message));
            }

            if(await this.clienteModel.userExists(datasRegister.nome)) {
                return res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            await this.clienteModel.register(datasRegister);

            return res.status(200).send(successResponse("Ussuario registrado com sucesso"));
        } catch(err) {
            return res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length) {
                return res.status(400).send(errorResponse("Dados invalidos", message));
            }

            if(!await this.clienteModel.userExists(datasLogin.nome)) {
                return res.status(404).send(errorResponse("Nome de usuario ou senha incorreto"));
            }

            const hashedPass: string = await this.clienteModel.getPasswordUsingUser(datasLogin.nome);

            if(!await this.validateDatasUserController.comparePassword(hashedPass, datasLogin.senha)){
                return res.status(401).send(errorResponse("Nome de usuario ou senha incorreto"));
            }

            const token: string = await this.generateTokenUser(datasLogin);
            return res.status(200).send(successResponse("Login realizado com sucesso", {token: token}));
        } catch (e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));   
        }
    }

    public async partnerList(req: FastifyRequest, res: FastifyReply, typeList: "all" | "received" | "sent" | "accepted" = "all"): Promise<FastifyReply> { 
        try {
            const id:number = await getTokenIdFromRequest(req);

            if(!id) {
                return res.status(404).send(errorResponse("Erro ao coletar lista de parcerias"));
            }
            
            const listPartner:fornecedorInterface[] = await this.fornecedorModel.getPartnerByIdCliente(id, typeList)
            return res.status(200).send(successResponse("Listado com sucesso", listPartner));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse("Erro interno no servidor"));
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
