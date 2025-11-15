import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface, queryFilterFornecedor } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";

import { generateToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { UserController } from "../interfaces/class/UserController";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface } from "../interfaces/clienteInterface";


class FornecedorController extends UserController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private clienteModel:ClienteModel = new ClienteModel();
    private validateDatasUserController:ValidateDatasUserController = new ValidateDatasUserController();

    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {            
            const datasRegister: fornecedorInterface = await req.body as fornecedorInterface;
            
            if(!datasRegister){
                return res.status(404).send(errorResponse("Dados não solicitados"))
            }

            const message = await this.validateDatasUserController.validateDatasFornecedor(datasRegister);
            

            if(message.length) {
                return res.status(400).send(errorResponse("dados invalidos", message));
            }

            if(await this.fornecedorModel.userExists(datasRegister.nome)) {
                return res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
                
            }

            datasRegister.senha = await this.validateDatasUserController.hashPassword(datasRegister.senha);

            await this.fornecedorModel.register(datasRegister);

            return res.status(200).send(successResponse("Ussuario registrado com sucesso"));
        } catch(err) {
            return res.status(500).send(errorResponse("Erro Interno no servidor", err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUserController.validateLogin(datasLogin);

            if(message.length){
                return res.status(400).send(errorResponse("dados invalidos", message));
            }

            if(!await this.fornecedorModel.userExists(datasLogin.nome)) {
                return res.status(404).send(errorResponse("Nome de usuario ou senha incorreto"));
                
            }

            const hashedPass:string = await this.fornecedorModel.getPasswordUsingUser(datasLogin.nome);
            
            if(!await this.validateDatasUserController.comparePassword(hashedPass, datasLogin.senha)) {
                return res.status(401).send(errorResponse("Nome de usuario ou senha incorreto"));
            }

            const token:string = await this.generateTokenUser(datasLogin);

            return res.status(200).send(successResponse("Login realizado com sucesso", {token: token}));
            
        } catch(err) {
            return res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    public async listAll(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilterFornecedor;
            const idCliente:number = await getTokenIdFromRequest(req);

            if(!await this.verifyQueryOptList(filterOpt))
                return res.status(404).send(errorResponse("Um ou mais valores do filtro estão invalidos"));


            const list:fornecedorInterface[] = await this.fornecedorModel.listAll(idCliente, filterOpt);

            
            return res.status(200).send(successResponse("Fornecedores listados com sucesso", {fornecedor: list, pagination: filterOpt}));
        } catch(e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async partnerList(req: FastifyRequest, res: FastifyReply, typeList: "all" | "received" | "sent" | "accepted" = "all"): Promise<FastifyReply> { 
        try {
            const id:number = await getTokenIdFromRequest(req);

            if(!id) {
                return res.status(404).send(errorResponse("Erro ao coletar lista de parcerias"));
            }

            const listPartner:clienteInterface[] = await this.clienteModel.getPartnerByIdFornecedor(id, typeList);

            return res.status(200).send(successResponse("Listado com sucesso", listPartner));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse("Erro interno no servidor"));
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

    private async verifyQueryOptList(queryOpt: queryFilterFornecedor): Promise<boolean>{
        try {
            if(Object.keys(queryOpt).length === 0) {
                return false;
            }

            const pagination = Number(queryOpt.pagination);
            const size = Number(queryOpt.size);
            const search = String(queryOpt.search);

            console.log(pagination, search, size)

            if(
                (isNaN(pagination) || isNaN(size)) ||
                (pagination <= 0 || size <= 0) || 
                (typeof search !== "string") ||
                (size > 100)
            ){
                return false;
            }

            queryOpt.pagination = Number(queryOpt.pagination);
            queryOpt.size = Number(queryOpt.size);

            return true;
        } catch(e) {
            console.log("Erro ao verificar query para listar fornecedor >>> ", e);
            throw new Error("Erro ao verificar query para listar fornecedor")
        }
    }
}

export { FornecedorController };
