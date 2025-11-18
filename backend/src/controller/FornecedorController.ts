import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/FornecedorModel";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { errorResponse, successResponse } from "../utils/response";
import { ValidateDatasUserController } from "./ValidateDatasUserController";
import { loginInterface } from "../interfaces/loginInterface";
import { payloadInterface } from "../interfaces/payloadInterface";

import { generateToken, getTokenIdFromRequest } from "../utils/tokenUtils";
import { UserController } from "../interfaces/class/UserController";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface } from "../interfaces/clienteInterface";
import { verifyQueryOptList } from "../utils/verifyQueryOptList";
import { queryFilter } from "../interfaces/clienteFornecedorInterface";


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
            const {...filterOpt} = req.query as queryFilter;
            const idCliente:number = await getTokenIdFromRequest(req);
            
            filterOpt.filterList = ["Nome", "Apelido", "Estabelecimento"];

            if(!await verifyQueryOptList(filterOpt))
                return res.status(404).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            if(!filterOpt.search)
                filterOpt.search = "";

            const list:fornecedorInterface[] = await this.fornecedorModel.listAll(idCliente, filterOpt);

            
            return res.status(200).send(successResponse("Fornecedores listados com sucesso", {list: list, pagination: filterOpt}));
        } catch(e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async partnerList(req: FastifyRequest, res: FastifyReply, typeList: "all" | "received" | "sent" | "accepted" = "all"): Promise<FastifyReply> { 
        try {
            const {...filterOpt} = req.query as queryFilter;
            const id:number = await getTokenIdFromRequest(req);

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(404).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!id) {
                return res.status(404).send(errorResponse("Erro ao coletar lista de parcerias"));
            }

            const listPartner:clienteInterface[] = await this.clienteModel.getPartnerByIdFornecedor(id, typeList, filterOpt);

            return res.status(200).send(successResponse("Listado com sucesso", {list: listPartner, pagination: filterOpt}));
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
}

export { FornecedorController };
