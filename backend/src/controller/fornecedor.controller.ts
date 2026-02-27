import { FastifyReply, FastifyRequest } from "fastify";
import { FornecedorModel } from "../models/fornecedor.model";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { ValidateDatasUser } from "../shared/validators/ValidateDatasUser";
import { Cursor, payloadInterface, queryFilter } from "../shared/interfaces/utilsInterfeces";
import { generateToken, getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { UserController } from "../shared/interfaces/class/UserController";
import { ClienteModel } from "../models/cliente.model";
import { fornecedorInterface, loginInterface, clienteInterface, TypesListUser } from "../shared/interfaces/userInterfaces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { ResponseApi } from "../shared/consts/responseApi";


class FornecedorController extends UserController{
    private fornecedorModel:FornecedorModel = new FornecedorModel();
    private clienteModel:ClienteModel = new ClienteModel();
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
            console.log(err);
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
                return res.status(404).send(errorResponse(ResponseApi.Auth.INVALID_CREDENTIALS));
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

    public async listAllCursor(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const {...filterOpt} = req.query as queryFilter;
            const idCliente:number = await getTokenIdFromRequest(req);
            
            filterOpt.filterList = ["Nome", "Apelido", "Estabelecimento"];

            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            
            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            // teste
            const {cursorValue, cursorId} = req.query as {cursorValue: string, cursorId: number};
            
            if(cursorValue && cursorId){
                const cursor:Cursor = {
                    id: cursorId,
                    value: cursorValue
                }

                filterOpt.cursor = cursor;
            }

            // console.log(filterOpt);


            const list = await this.fornecedorModel.listAllCursor(idCliente, filterOpt);

            return res.status(200).send(successResponse(ResponseApi.Users.LIST_SUCCESS, {list}));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async me(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const id:number = await getTokenIdFromRequest(req);

            const {senha, ...data} = await this.fornecedorModel.findUserById(id);

            return res.status(200).send(successResponse(ResponseApi.Users.LIST_USER_DATA, data));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async update(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            // Fazer função de atualização-
            const id:number = await getTokenIdFromRequest(req);
            const dataUpdate: fornecedorInterface = await req.body as fornecedorInterface;
            
            
            // Verifica se dados recebidos esta vazio
            if(Object.keys(dataUpdate).length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Verifica os dados recebidos
            const message = await this.validateDatasUser.validateDatasUpdateFornecedor(dataUpdate);
            if(message.length) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA, message));
            }

            // Verifica se usuario existe no banco de dados (ATUALIZAR COM URGENCIA) 
            // retorno do controler deve ter tipo undefined ou null para melhor verificação dos dados
            // Deve ser mais concreto com os dados (codigo feito  antes de obter mais experiencia)
            const currentUser = await this.fornecedorModel.findUserById(id);
            if(Object.keys(currentUser || {}).length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Auth.USER_NOT_FOUND));
            }

            // Verifica se nome existe, pois e um dado unico. Futuramente numero de telefone verificar tmb
            const dataUser = await this.fornecedorModel.findByUsername(dataUpdate.nome);

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

            await this.fornecedorModel.update(dataUpdate, id);

            return res.status(200).send(successResponse(ResponseApi.Users.UPDATE_SUCCESS));
        } catch(e) {
            console.log(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async partnerList(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> { 
        try {
            const {idCliente, ...filterOpt} = req.query as queryFilter & { idCliente?: string};;
            const {typeList} = (req.params as {typeList: string | null});
            const idFornecedor:number = await getTokenIdFromRequest(req);


            if(!idFornecedor) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.LIST_ERROR));
            }
            
            // if(!filterOpt.search)
            //     filterOpt.search = "";
            
            filterOpt.filterList = ["Nome", "Apelido", "Data"];
            if(!filterOpt.filter)
                filterOpt.filter = "Nome";
            
            const TYPES = ["accepted", "all", "none", "received", "sent"] as TypesListUser[];
            const lowTypeList = typeList ? typeList?.toLowerCase() : "all"; 
            // console.log("typeList: ", typeList?.toLowerCase(), lowTypeList);
            if(!TYPES.includes(lowTypeList as TypesListUser)){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER))
            };
            
            // console.log(await verifyQueryOptList(filterOpt), filterOpt);
            
            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
            
            let idClienteForm: number | undefined;
            if(idCliente) {
                idClienteForm = Number(idCliente);
                if(Number.isNaN(idClienteForm)) {
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }



            const listPartner:clienteInterface[] = await this.clienteModel.getPartnerByIdFornecedor2(idFornecedor, lowTypeList as TypesListUser, filterOpt, idClienteForm);

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
