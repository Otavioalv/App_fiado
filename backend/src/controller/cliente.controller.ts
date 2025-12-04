import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/cliente.model";
import { clienteInterface, loginInterface, fornecedorInterface} from "../shared/interfaces/userInterfaces";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { generateToken, getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { UserController } from "../shared/interfaces/class/UserController";
import { FornecedorModel } from "../models/fornecedor.model";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { queryFilter, payloadInterface } from "../shared/interfaces/utilsInterfeces";
import { MessageInterface } from "../shared/interfaces/notifierInterfaces";
import { NotificationModel } from "../models/notification.model";
import { ResponseApi } from "../shared/consts/responseApi";


class ClienteController extends UserController{
    private clienteModel: ClienteModel = new ClienteModel();
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private validateDatasUser: ValidateDatasUser = new ValidateDatasUser();
    
    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface; 
            const message = await this.validateDatasUser.validateDatasCliente(datasRegister);
            
            if(!datasRegister){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA))
            }

            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            if(await this.clienteModel.userExists(datasRegister.nome)) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.USER_ALREADY_EXISTS));
            }

            datasRegister.senha = await this.validateDatasUser.hashPassword(datasRegister.senha);

            await this.clienteModel.register(datasRegister);

            return res.status(201).send(successResponse(ResponseApi.Auth.REGISTER_SUCCESS));
        } catch(err) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;
            const message = await this.validateDatasUser.validateLogin(datasLogin);

            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            if(!await this.clienteModel.userExists(datasLogin.nome)) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
            }

            const hashedPass: string = await this.clienteModel.getPasswordUsingUser(datasLogin.nome);

            if(!await this.validateDatasUser.comparePassword(hashedPass, datasLogin.senha)){
                return res.status(401).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
            }

            const token: string = await this.generateTokenUser(datasLogin);
            return res.status(200).send(successResponse(ResponseApi.Auth.LOGIN_SUCCESS, {token: token}));
        } catch (e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));   
        }
    }

     public async listAll(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const idFornecedor:number = await getTokenIdFromRequest(req);

            filterOpt.filterList = ["Nome", "Apelido"]
            
            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            
            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            const list:clienteInterface[] = await this.clienteModel.listAll(idFornecedor, filterOpt);
            
            return res.status(200).send(successResponse(ResponseApi.Users.LIST_SUCCESS, {list: list, pagination: filterOpt}));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async partnerList(req: FastifyRequest, res: FastifyReply, typeList: "all" | "received" | "sent" | "accepted" = "all"): Promise<FastifyReply> { 
        try {
            const {...filterOpt} = req.query as queryFilter;
            const id:number = await getTokenIdFromRequest(req);

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            if(!id) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }
            
            const listPartner:fornecedorInterface[] = await this.fornecedorModel.getPartnerByIdCliente(id, typeList, filterOpt);

            return res.status(200).send(successResponse(ResponseApi.Partner.LIST_SUCCESS, {list: listPartner, pagination: filterOpt}));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
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
