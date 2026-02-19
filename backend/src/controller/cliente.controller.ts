import { FastifyReply, FastifyRequest } from "fastify";
import { ClienteModel } from "../models/cliente.model";
import { clienteInterface, loginInterface, fornecedorInterface, TypesListUser} from "../shared/interfaces/userInterfaces";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { generateToken, getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { UserController } from "../shared/interfaces/class/UserController";
import { FornecedorModel } from "../models/fornecedor.model";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { queryFilter, payloadInterface } from "../shared/interfaces/utilsInterfeces";
import { ResponseApi } from "../shared/consts/responseApi";


class ClienteController extends UserController{
    private clienteModel: ClienteModel = new ClienteModel();
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private validateDatasUser: ValidateDatasUser = new ValidateDatasUser();
    
    public async register(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const datasRegister: clienteInterface = await req.body as clienteInterface; 
            console.log("ANTES: ", datasRegister)
            const message = await this.validateDatasUser.validateDatasCliente(datasRegister);
            console.log("DEPOIS: ", datasRegister)

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
            console.log(datasLogin, message);
            
            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            if(!await this.clienteModel.userExists(datasLogin.nome)) {
                return res.status(404).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
            }

            const hashedPass: string = await this.clienteModel.getPasswordUsingUser(datasLogin.nome);

            if(!await this.validateDatasUser.comparePassword(hashedPass, datasLogin.senha)){
                return res.status(404).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
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

    public async me(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const id:number = await getTokenIdFromRequest(req);

            const {senha, ...data} = await this.clienteModel.findUserById(id);

            return res.status(200).send(successResponse(ResponseApi.Users.LIST_USER_DATA, data));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }
    
    public async update(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            // Fazer função de atualização-
            const id:number = await getTokenIdFromRequest(req);
            const dataUpdate: clienteInterface = await req.body as clienteInterface;
            
            // console.log("UPDATE CONTROLLER: ", Object.keys(dataUpdate));

            // Verifica se dados recebidos esta vazio
            if(Object.keys(dataUpdate).length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }
            
            // Verifica os dados recebidos
            const message = await this.validateDatasUser.validateDatasUpdateCliente(dataUpdate);
            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            // Verifica se usuario existe no banco de dados (ATUALIZAR COM URGENCIA) 
            // retorno do controler deve ter tipo undefined ou null para melhor verificação dos dados
            // Deve ser mais concreto com os dados (codigo feito  antes de obter mais experiencia)
            const currentUser = await this.clienteModel.findUserById(id);
            if(Object.keys(currentUser || {}).length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.USER_NOT_FOUND));
            }

            // Verifica se nome existe, pois e um dado unico. Futuramente numero de telefone verificar tmb
            const dataUser = await this.clienteModel.findByUsername(dataUpdate.nome);

            /* 
                se o nome for igual ao recebido: nao enviar erro
                se o nome existir enviar erro

                nome tem q ser diferente, 
            */
            if(Object.keys(dataUser || {}).length > 0 && currentUser.nome !== dataUser.nome) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.USER_ALREADY_EXISTS_UPD));
            }
            
            /* 
                {
                    "id_cliente": 153,
                    "nome": "otavio",
                    "telefone": "92992348389",
                    "apelido": "senhapadrao"
                }
            */

            await this.clienteModel.update(dataUpdate, id);

            return res.status(200).send(successResponse(ResponseApi.Users.UPDATE_SUCCESS));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }
    
    public async partnerList(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> { 
        try {
            const {idFornecedor, ...filterOpt} = req.query as queryFilter & { idFornecedor?: string};
            const {typeList} = (req.params as {typeList: string | null});
            const idCliente:number = await getTokenIdFromRequest(req);

            if(!idCliente) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }

            filterOpt.filterList = ["Nome", "Apelido", "Estabelecimento", "Data"];
            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            
            
            const TYPES = ["accepted", "all", "none", "received", "sent"] as TypesListUser[];
            const lowTypeList = typeList ? typeList?.toLowerCase() : "all"; 
            // console.log("typeList: ", typeList?.toLowerCase(), lowTypeList);
            if(!TYPES.includes(lowTypeList as TypesListUser)){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER))
            };

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            let fornecedorId: number | undefined;

            if(idFornecedor) {
                fornecedorId = Number(idFornecedor);
                if(Number.isNaN(fornecedorId)) {
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }
            
            const listPartner:fornecedorInterface[] = await this.fornecedorModel.getPartnerByIdCliente(idCliente, lowTypeList as TypesListUser, filterOpt, fornecedorId);

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
