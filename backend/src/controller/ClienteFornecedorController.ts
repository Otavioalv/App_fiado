import { FastifyReply, FastifyRequest } from "fastify";
import { idsFornecedorInterface } from "../interfaces/idsFornecedorInterface";
import { getTokenIdFromRequest } from "../utils/tokenUtils";
import { errorResponse, successResponse } from "../utils/response";
import { fornecedorInterface } from "../interfaces/fornecedorInterface";
import { FornecedorModel } from "../models/FornecedorModel";
import { ClienteFornecedorModel } from "../models/ClienteFornecedorModel";
import { clienteFornecedorInterface } from "../interfaces/clienteFornecedorInterface";


class ClienteFornecedorController {
    private fornecedorModel: FornecedorModel = new FornecedorModel();
    private clienteFornecedorModel: ClienteFornecedorModel = new ClienteFornecedorModel();

    public async associarComFornecedor(req: FastifyRequest, res: FastifyReply): Promise<void>{
        try {
            const ids:idsFornecedorInterface = await req.body as idsFornecedorInterface;
            const id_cliente: number = await getTokenIdFromRequest(req);

            if(!ids || !ids.ids.length || !ids.ids.every((elem) => typeof elem === 'number')) {
                res.status(404).send(errorResponse("Dados invalidos"));
                return;
            }

            // Remove elementos duplicados da array
            ids.ids = [... new Set(ids.ids)];

            // Procura fornecesdores com base na lista de ids
            const listFornecedor: fornecedorInterface[] = await this.fornecedorModel.findMultUsersByIds(ids);
            // Verifica se encontrou todos os fornecedores
            if(listFornecedor.length < ids.ids.length) {
                // verifica quais Ids nao existem no listFornecedor e os retornam
                const foundIds = new Set(listFornecedor.map(fornecedor => fornecedor.id_fornecedor));
                const invalidIds: number[] = ids.ids.filter(id => !foundIds.has(id));

                res.status(404).send(errorResponse("Ussuario nao existem", {invalidIds: invalidIds}));
                return;
            }

            // Procura associações existentes com basse na array de ids de fornecedores, e id do cliente
            const listPartner: clienteFornecedorInterface[] = await this.clienteFornecedorModel.findMultPartner(ids, id_cliente);
            // Verifica se associação ja existe
            if(listPartner.length > 0) {
                // verifica quais ids existem no listPartner e os retorna
                const foundIds = new Set(listPartner.map(partner => partner.fk_fornecedor_id));
                // const invalidIds: number[] = ids.ids.filter(id => foundIds.has(id)); 

                // res.status(404).send(errorResponse("Ja existe associação com o/os seguinte/es id/s", {invalidIds: invalidIds}));
                // return;

                ids.ids = ids.ids.filter(id => !foundIds.has(id)); 
                
                if(!ids.ids.length) {
                    res.status(404).send(errorResponse("Todos estes fornecedores ja receberam solicitação deste ussuario"))
                    return;
                }
            }

            await this.clienteFornecedorModel.associarComFornecedor(ids, id_cliente);

            res.status(200).send(successResponse("Solicitações enviadas com sucesso"));
        } catch(e) {
            res.status(500).send(errorResponse("Erro interno no servidor", e));
        }
    }
}

export {ClienteFornecedorController}