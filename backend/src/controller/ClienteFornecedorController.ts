import { FastifyReply, FastifyRequest } from "fastify";
import { getTokenIdFromRequest } from "../utils/tokenUtils";
import { errorResponse, successResponse } from "../utils/response";
import { idsPartnerInterface, fornecedorInterface, clienteFornecedorInterface, clienteInterface, userInterface } from "../interfaces/userInterfaces";
import { FornecedorModel } from "../models/FornecedorModel";
import { ClienteFornecedorModel } from "../models/ClienteFornecedorModel";
import { ClienteModel } from "../models/ClienteModel";


class ClienteFornecedorController {
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private clienteModel: ClienteModel = new ClienteModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();

    public async associarComFornecedor(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const ids:idsPartnerInterface = await req.body as idsPartnerInterface;
            const id_cliente: number = await getTokenIdFromRequest(req);

            if(!ids || !ids.ids.length || !ids.ids.every((elem) => typeof elem === 'number')) {
                return res.status(400).send(errorResponse("Dados invalidos"));
            }

            // Remove elementos duplicados da array
            ids.ids = [... new Set(ids.ids)];

            // Procura fornecesdores com base na lista de ids
            const listFornecedor: fornecedorInterface[] = await this.fornecedorModel.findMultUsersByIds(ids);
            
            // Verifica se encontrou todos os fornecedores
            if(listFornecedor.length < ids.ids.length) {
                // verifica quais Ids nao existem no listFornecedor e os retornam
                return res.status(400).send(errorResponse("Um ou mais fornecedores não existem"));
            }

            // Procura associações existentes com basse na array de ids de fornecedores, e id do cliente
            const listPartner: clienteFornecedorInterface[] = await this.clienteFornecedorModel.findMultPartner(ids, id_cliente);
            
            // Verifica se associação ja existe
            if(listPartner.length > 0) {
                // verifica quais ids existem no listPartner e os retorna
                const foundIds = new Set(listPartner.map(partner => partner.fk_fornecedor_id));

                ids.ids = ids.ids.filter(id => !foundIds.has(id)); 
                
                if(!ids.ids.length) {
                    return res.status(400).send(errorResponse("Todos estes fornecedores ja receberam solicitação de parceria"))
                }
            }

            await this.clienteFornecedorModel.associarComFornecedor(ids, id_cliente);

            return res.status(201).send(successResponse("Solicitações enviadas com sucesso"));
        } catch(e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }

    public async associarComCliente(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply> {
        try {
            const ids: idsPartnerInterface = await req.body as idsPartnerInterface;
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            // console.log("id_fornecedor: ", id_fornecedor);

            if(!ids || !ids.ids.length || !ids.ids.every((elem) => typeof elem === 'number')) {
                return res.status(400).send(errorResponse("Dados invalidos"));
            }

            // Remove elementos duplicados da array
            ids.ids = [... new Set(ids.ids)];

            const listCliente: clienteInterface[] = await this.clienteModel.findMultUsersByIds(ids);

            if(listCliente.length < ids.ids.length) {
                return res.status(400).send(errorResponse("Um ou mais clientes não existem"));
            }



            const listPartner: clienteFornecedorInterface[] = await this.clienteFornecedorModel.findMultPartnerClient(ids, id_fornecedor);
            console.log(listCliente);

            // Verifica se associação ja existe
            if(listPartner.length > 0) {
                // verifica quais ids existem no listPartner e os retorna
                const foundIds = new Set(listPartner.map(partner => partner.fk_cliente_id));

                ids.ids = ids.ids.filter(id => !foundIds.has(id)); 
                
                if(!ids.ids.length) {
                    return res.status(400).send(errorResponse("Todos estes clientes ja receberam solicitação de parceria"))
                }
            }
    
            // Envia no banco de dados
            await this.clienteFornecedorModel.associarComCliente(ids, id_fornecedor);

            // Envia notificação
            const notifier = req.server.notifier;
            const fornecedorData = await this.fornecedorModel.findUserById(id_fornecedor);

            listCliente.forEach(cliente => {
                notifier.toUser(
                    cliente.id_cliente?.toString() ?? "0",
                    "new-message",
                    {
                        type: "new_partner",
                        message: `Você recebeu uma nova solicitação de parceria ${cliente.nome}${cliente.apelido ? ` conhecido por ${cliente.apelido}.` : "."}`,
                        user: {
                            id: id_fornecedor,
                            nome: fornecedorData.nome,
                            apelido: fornecedorData.apelido
                        }
                    }
                );
            });

            /* 
            notifier.toUser(
    idCliente.toString(),
    "notify",
    NotificationTemplates.novaSolicitacao(id_fornecedor)
);
 */
            // ---------------------------------------------------------------------

            return res.status(201).send(successResponse("Solicitações enviadas com sucesso"));
        }catch(e) {
            return res.status(500).send(errorResponse("Erro interno no servidor", e));
        }

    }

    public async aceitarParceriaCliente(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const {idPartner} = await req.body as {idPartner: number};
            const id_fornecedor: number = await getTokenIdFromRequest(req);

            if(!idPartner || typeof idPartner !== 'number') {
                return res.status(400).send(errorResponse("Dados invalidos"));
            }   

            if(!await this.clienteFornecedorModel.findPartnerCliente(idPartner, id_fornecedor)) {
                return res.status(400).send(errorResponse("Cliente invalido"));
            }

            await this.clienteFornecedorModel.aceitarParceriaCliente(id_fornecedor, idPartner);
            
            return res.status(201).send(successResponse("Parceria aceita com sucesso"));
        }catch(e) {
            console.log("aceitarParceriaCliente >>> ", e);
            return res.status(500).send(errorResponse("Erro interno no servidor"));
        }
    }

    public async aceitarParceriaFornecedor(req: FastifyRequest, res: FastifyReply): Promise<FastifyReply>{
        try {
            const {idPartner} = await req.body as {idPartner: number};
            const id_cliente: number = await getTokenIdFromRequest(req);

            if(!idPartner || typeof idPartner !== 'number') {
                return res.status(404).send(errorResponse("Dados invalidos"));
            }   

            if(!await this.clienteFornecedorModel.findPartnerFornecedor(idPartner, id_cliente)) {
                return res.status(404).send(errorResponse("Cliente invalido"));
            }

            await this.clienteFornecedorModel.aceitarParceriaFornecedor(id_cliente, idPartner);
            
            return res.status(201).send(successResponse("Parceria aceita com sucesso"));
        }catch(e) {
            console.log("aceitarParceriaCliente >>> ", e);
            return res.status(500).send(errorResponse("Erro interno no servidor"));
        }
    }
}

export {ClienteFornecedorController}
