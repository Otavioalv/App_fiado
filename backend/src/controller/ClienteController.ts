import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/ClienteModel";
import { clienteInterface, loginInterface, fornecedorInterface} from "../shared/interfaces/userInterfaces";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { generateToken, getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { UserController } from "../shared/interfaces/class/UserController";
import { FornecedorModel } from "../models/FornecedorModel";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { queryFilter, payloadInterface } from "../shared/interfaces/utilsInterfeces";


class ClienteController extends UserController{
    private clienteModel: ClienteModel = new ClienteModel();
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private validateDatasUser: ValidateDatasUser = new ValidateDatasUser();
    
    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface;
            
            const message = await this.validateDatasUser.validateDatasCliente(datasRegister);
            
            if(message.length) {
                return res.status(400).send(errorResponse("Dados invalidos", message));
            }

            if(await this.clienteModel.userExists(datasRegister.nome)) {
                return res.status(400).send(errorResponse("Usuario já existe. Realize o login"));
            }

            datasRegister.senha = await this.validateDatasUser.hashPassword(datasRegister.senha);

            await this.clienteModel.register(datasRegister);

            return res.status(201).send(successResponse("Ussuario registrado com sucesso"));
        } catch(err) {
            return res.status(500).send(errorResponse("Erro interno no servidor", err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUser.validateLogin(datasLogin);

            if(message.length) {
                return res.status(400).send(errorResponse("Dados invalidos", message));
            }

            if(!await this.clienteModel.userExists(datasLogin.nome)) {
                return res.status(400).send(errorResponse("Nome de usuario ou senha incorreto"));
            }

            const hashedPass: string = await this.clienteModel.getPasswordUsingUser(datasLogin.nome);

            if(!await this.validateDatasUser.comparePassword(hashedPass, datasLogin.senha)){
                return res.status(401).send(errorResponse("Nome de usuario ou senha incorreto"));
            }

            const token: string = await this.generateTokenUser(datasLogin);
            return res.status(200).send(successResponse("Login realizado com sucesso", {token: token}));
        } catch (e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));   
        }
    }

     public async listAll(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const idFornecedor:number = await getTokenIdFromRequest(req);

            filterOpt.filterList = ["Nome", "Apelido"]
            
            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            const list:clienteInterface[] = await this.clienteModel.listAll(idFornecedor, filterOpt);
            
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
                return res.status(400).send(errorResponse("Um ou mais valores do filtro estão invalidos"));

            if(!id) {
                return res.status(400).send(errorResponse("Erro ao coletar lista de parcerias"));
            }
            
            const listPartner:fornecedorInterface[] = await this.fornecedorModel.getPartnerByIdCliente(id, typeList, filterOpt);

            return res.status(200).send(successResponse("Listado com sucesso", {list: listPartner, pagination: filterOpt}));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse("Erro interno no servidor"));
        }
    }

    private async generateTokenUser(user: loginInterface): Promise<string>{
        try {
            const cliente = await this.clienteModel.findByUsername(user.nome);

            if(!cliente.id_cliente)
                throw new Error("Id do usuario para gerar tokem não foi recebido");
        
            const payload: payloadInterface = {
                id: cliente.id_cliente,
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
