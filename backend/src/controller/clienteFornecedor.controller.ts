import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { idsPartnerInterface, fornecedorInterface, clienteFornecedorInterface, clienteInterface, userInterface } from "../shared/interfaces/userInterfaces";
import { FornecedorModel } from "../models/fornecedor.model";
import { ClienteFornecedorModel } from "../models/clienteFornecedor.model";
import { ClienteModel } from "../models/cliente.model";
import { Notifications } from "../common/messages/notifications";
import { NotificationInput, UserType } from "../shared/interfaces/notifierInterfaces";
import { ResponseApi } from "../shared/consts/responseApi";


class ClienteFornecedorController {
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private clienteModel: ClienteModel = new ClienteModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();
  

    public async associarComFornecedor(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const ids:idsPartnerInterface = await req.body as idsPartnerInterface;
            const id_cliente: number = await getTokenIdFromRequest(req);

            if(!ids || !ids.ids.length || !ids.ids.every((elem) => typeof elem === 'number')) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Remove elementos duplicados da array
            ids.ids = [... new Set(ids.ids)];

            // Procura fornecesdores com base na lista de ids
            const listFornecedor: fornecedorInterface[] = await this.fornecedorModel.findMultUsersByIds(ids);
            
            // Verifica se encontrou todos os fornecedores
            if(listFornecedor.length < ids.ids.length) {
                // verifica quais Ids nao existem no listFornecedor e os retornam
                return res.status(400).send(errorResponse(ResponseApi.Partner.SUPPLIER_NOT_FOUND));
            }

            // Procura associações existentes com basse na array de ids de fornecedores, e id do cliente
            const listPartner: clienteFornecedorInterface[] = await this.clienteFornecedorModel.findMultPartner(ids, id_cliente);
            
            // Verifica se associação ja existe
            if(listPartner.length > 0) {
                // verifica quais ids existem no listPartner e os retorna
                const foundIds = new Set(listPartner.map(partner => partner.fk_fornecedor_id));

                ids.ids = ids.ids.filter(id => !foundIds.has(id)); 
                
                if(!ids.ids.length) {
                    return res.status(400).send(errorResponse(ResponseApi.Partner.SUPPLIER_ALREADY_REQUESTED))
                }
            }

            await this.clienteFornecedorModel.associarComFornecedor(ids, id_cliente);


            const notificationService = req.server.notificationService;
            const clienteData = await this.clienteModel.findUserById(id_cliente);

            for(const fornecedor of listFornecedor) {
                const data: NotificationInput = {
                    toId: fornecedor.id_fornecedor!.toString(),
                    created_at: new Date(),
                    fromUserType: "cliente",
                    toUserType: "fornecedor",
                    user: {
                        id: id_cliente,
                        nome: clienteData.nome,
                        apelido: clienteData.apelido
                    }
                };

                await notificationService.saveAndSendPrepared(
                    Notifications.novaSolicitacaoParceria(data),
                    data
                );
            };

            return res.status(201).send(successResponse(ResponseApi.Partner.PARTNER_REQUEST_SENT));
        } catch(e) {
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR, e));
        }
    }

    public async associarComCliente(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const ids: idsPartnerInterface = await req.body as idsPartnerInterface;
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            // console.log("id_fornecedor: ", id_fornecedor);

            if(!ids || !ids.ids.length || !ids.ids.every((elem) => typeof elem === 'number')) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // Remove elementos duplicados da array
            ids.ids = [... new Set(ids.ids)];

            const listCliente: clienteInterface[] = await this.clienteModel.findMultUsersByIds(ids);

            if(listCliente.length < ids.ids.length) {
                return res.status(400).send(errorResponse(ResponseApi.Partner.CLIENT_NOT_FOUND));
            }



            const listPartner: clienteFornecedorInterface[] = await this.clienteFornecedorModel.findMultPartnerClient(ids, id_fornecedor);
            // console.log(listCliente);

            // Verifica se associação ja existe
            if(listPartner.length > 0) {
                // verifica quais ids existem no listPartner e os retorna
                const foundIds = new Set(listPartner.map(partner => partner.fk_cliente_id));

                ids.ids = ids.ids.filter(id => !foundIds.has(id)); 
                
                if(!ids.ids.length) {
                    return res.status(400).send(errorResponse(ResponseApi.Partner.CLIENT_ALREADY_REQUESTED))
                }
            }
    
            // Envia no banco de dados
            await this.clienteFornecedorModel.associarComCliente(ids, id_fornecedor);

            // Envia notificação
            const notificationService = req.server.notificationService;
            const fornecedorData = await this.fornecedorModel.findUserById(id_fornecedor);

            for(const cliente of listCliente){
                const data: NotificationInput = {
                    toId: cliente.id_cliente!.toString(),
                    created_at: new Date(),
                    fromUserType: "fornecedor",
                    toUserType: "cliente",
                    user: {
                        id: id_fornecedor,
                        nome: fornecedorData.nome,
                        apelido: fornecedorData.apelido
                    }
                };

                await notificationService.saveAndSendPrepared
                    (Notifications.novaSolicitacaoParceria(data),
                    data
                );
            };

            return res.status(201).send(successResponse(ResponseApi.Partner.PARTNER_REQUEST_SENT));
        }catch(e) {
            console.log(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }

    }

    public async aceitarParceriaCliente(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const {idPartner} = await req.body as {idPartner: number};
            const id_fornecedor: number = await getTokenIdFromRequest(req);



            if(!idPartner || typeof idPartner !== 'number') {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }   

            if(!await this.clienteFornecedorModel.findPartnerCliente(idPartner, id_fornecedor)) {
                return res.status(400).send(errorResponse(ResponseApi.Users.CLIENT_INVALID));
            }

        
            
            await this.clienteFornecedorModel.aceitarParceriaCliente(id_fornecedor, idPartner);


            // Mandar notificação
            const notificationService = req.server.notificationService;
            const fornecedorData = await this.fornecedorModel.findUserById(id_fornecedor);

            const data: NotificationInput = {
                toId: idPartner.toString(),
                created_at: new Date(),
                fromUserType: "fornecedor",
                toUserType: "cliente",
                user: {
                    id: id_fornecedor,
                    nome: fornecedorData.nome,
                    apelido: fornecedorData.apelido
                }
            };
            await notificationService.saveAndSendPrepared
                (Notifications.parceriaAceita(data),
                data
            );
            
            return res.status(201).send(successResponse(ResponseApi.Partner.PARTNER_ACCEPT));
        }catch(e) {
            console.log("aceitarParceriaCliente >>> ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async aceitarParceriaFornecedor(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const {idPartner} = await req.body as {idPartner: number};
            const id_cliente: number = await getTokenIdFromRequest(req);

            if(!idPartner || typeof idPartner !== 'number') {
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            if(!await this.clienteFornecedorModel.findPartnerFornecedor(idPartner, id_cliente)) {
                return res.status(404).send(errorResponse(ResponseApi.Users.SUPPLIER_INVALID));
            }

            await this.clienteFornecedorModel.aceitarParceriaFornecedor(id_cliente, idPartner);

            // Mando notificação
            const notificationService = req.server.notificationService;
            const clienteData = await this.clienteModel.findUserById(id_cliente);

            console.log(idPartner, id_cliente);
            console.log(clienteData);

            const data: NotificationInput = {
                toId: idPartner.toString(),
                created_at: new Date(),
                fromUserType: "cliente",
                toUserType: "fornecedor",
                user: {
                    id: id_cliente,
                    nome: clienteData.nome,
                    apelido: clienteData.apelido
                }
            };
            await notificationService.saveAndSendPrepared
                (Notifications.parceriaAceita(data),
                data
            );

            
            return res.status(201).send(successResponse(ResponseApi.Partner.PARTNER_ACCEPT));
        }catch(e) {
            console.log("aceitarParceriaCliente >>> ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async rejectPartner(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply>{
        try {
            const {idPartner} = await req.body as {idPartner: number};
            const fromUserId: number = await getTokenIdFromRequest(req);

            if(!idPartner || typeof idPartner !== 'number') {
                return res.status(404).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }   


            // Unificar isso em uma função
            if(userType === "cliente") {
                if(!await this.clienteFornecedorModel.findPartnerFornecedor(idPartner, fromUserId)) {
                    return res.status(404).send(errorResponse(ResponseApi.Users.SUPPLIER_INVALID));
                }
            } else if(userType === "fornecedor") {
                if(!await this.clienteFornecedorModel.findPartnerCliente(idPartner, fromUserId)) {
                    return res.status(404).send(errorResponse(ResponseApi.Users.CLIENT_INVALID));
                }
            }

            await this.clienteFornecedorModel.rejectPartner(fromUserId, idPartner, userType);
            
            return res.status(201).send(successResponse(ResponseApi.Partner.PARTNER_REJECT));
        }catch(e) {
            console.log("aceitarParceriaCliente >>> ", e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }
}

export {ClienteFornecedorController}
