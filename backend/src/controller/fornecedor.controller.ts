import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/fornecedor.model";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { payloadInterface, queryFilter } from "../shared/interfaces/utilsInterfeces";
import { generateToken, getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { UserController } from "../shared/interfaces/class/UserController";
import { ClienteModel } from "../models/cliente.model";
import { fornecedorInterface, loginInterface, clienteInterface } from "../shared/interfaces/userInterfaces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { MessageInterface } from "../shared/interfaces/notifierInterfaces";
import { NotificationModel } from "../models/notification.model";
import { ResponseApi } from "../shared/consts/responseApi";


class FornecedorController extends UserController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private clienteModel:ClienteModel = new ClienteModel();
    private notificationModel: NotificationModel = new NotificationModel();
    private validateDatasUser:ValidateDatasUser = new ValidateDatasUser();

    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {            
            const datasRegister: fornecedorInterface = await req.body as fornecedorInterface;
            const message = await this.validateDatasUser.validateDatasFornecedor(datasRegister);

            if(!datasRegister){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA))
            }

            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            if(await this.fornecedorModel.userExists(datasRegister.nome)) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.USER_ALREADY_EXISTS));
                
            }

            datasRegister.senha = await this.validateDatasUser.hashPassword(datasRegister.senha);

            await this.fornecedorModel.register(datasRegister);

            return res.status(201).send(successResponse(ResponseApi.Auth.REGISTER_SUCCESS));
        } catch(err) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, err));
        }
    }

    public async login(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const datasLogin: loginInterface = await req.body as loginInterface;

            const message = await this.validateDatasUser.validateLogin(datasLogin);

            if(message.length){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            if(!await this.fornecedorModel.userExists(datasLogin.nome)) {
                return res.status(404).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
                
            }

            const hashedPass:string = await this.fornecedorModel.getPasswordUsingUser(datasLogin.nome);
            
            if(!await this.validateDatasUser.comparePassword(hashedPass, datasLogin.senha)) {
                return res.status(401).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
            }

            const token:string = await this.generateTokenUser(datasLogin);

            return res.status(200).send(successResponse(ResponseApi.Auth.LOGIN_SUCCESS, {token: token}));
            
        } catch(err) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, err));
        }
    }

    public async listAll(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const idCliente:number = await getTokenIdFromRequest(req);
            
            filterOpt.filterList = ["Nome", "Apelido", "Estabelecimento"];

            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            
            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            const list:fornecedorInterface[] = await this.fornecedorModel.listAll(idCliente, filterOpt);

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
                return res.status(404).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }

            const listPartner:clienteInterface[] = await this.clienteModel.getPartnerByIdFornecedor(id, typeList, filterOpt);

            return res.status(200).send(successResponse(ResponseApi.Partner.LIST_SUCCESS, {list: listPartner, pagination: filterOpt}));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    private async generateTokenUser(user: loginInterface): Promise<string>{
        try{
            const fornecedor = await this.fornecedorModel.findByUsername(user.nome);

            if(!fornecedor.id_fornecedor)
                throw new Error("Id do usuario para gerar tokem não foi recebido");
        
            const payload: payloadInterface =  { 
                id: fornecedor.id_fornecedor,
                nome: fornecedor.nome,
                usuario: "fornecedor"
            };

            const token:string = await generateToken(payload);

            return token;
        } catch(e) {
            throw e;
        }
    }
}

export { FornecedorController };
