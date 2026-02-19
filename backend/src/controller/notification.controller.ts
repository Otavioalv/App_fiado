import { FastifyReply, FastifyRequest } from "fastify";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";
import { getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { MessageInterface, UserType } from "../shared/interfaces/notifierInterfaces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { NotificationModel } from "../models/notification.model";
import { ResponseApi } from "../shared/consts/responseApi";
import { MessageListType } from "../shared/interfaces/productInterface";

export class NotificationController {
    private notificationModel: NotificationModel = new NotificationModel();

    public async listMessages(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply> { 
        try {
            const {idMensaagem, ...filterOpt} = req.query as queryFilter & {idMensaagem?: string};
            const id:number = await getTokenIdFromRequest(req);

            const {typeList} = req.params as {typeList?: string};
               
            const TYPES_LIST = ["all", "read", "unread"] as MessageListType[];
            const uppTypeList: MessageListType = typeList ? typeList.toLocaleLowerCase() as MessageListType : "all" as MessageListType;
            
            if(!TYPES_LIST.includes(uppTypeList as MessageListType)){
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
            }

            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            if(!id) {
                return res.status(404).send(errorResponse(ResponseApi.Messages.LIST_ERROR));
            }

            let idMenssagemForm: number | undefined;
            if(idMensaagem){
                idMenssagemForm = Number(idMensaagem);
                if(Number.isNaN(idMenssagemForm)) {
                    return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));
                }
            }


            const listMsg: MessageInterface[] = await this.notificationModel.getNotification({
                toUserId: id, 
                toUserType: userType, 
                filterOpt: filterOpt, 
                typeList: uppTypeList,
                idMenssagem: idMenssagemForm,
            });

            // return res.status(200).send(successResponse("Listado com sucesso", {list: listPartner, pagination: filterOpt}));
            return res.status(200).send(successResponse(ResponseApi.Messages.LIST_SUCCESS, {list: listMsg, pagination: filterOpt}));

        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async deleteMessages(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply> { 
        try {
            const dataIds = req.body as number[];
            const idUser: number = await getTokenIdFromRequest(req);

            if (!Array.isArray(dataIds) || dataIds.length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            if (!dataIds.every(id => Number.isInteger(id) && id > 0)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FORMAT));
            }

            const result = await this.notificationModel.deleteManyMessages(dataIds, idUser, userType);
            
            if (!result) {
                return res.status(400).send(errorResponse(ResponseApi.Messages.NOT_FOUND));
            }

            return res.status(200).send(successResponse(ResponseApi.Messages.DELETE_SUCCESS));
        } catch(e) {
            console.error(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    // Talvez precise do userType
    public async markReadMessage(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply>{
        try{
            const userId = await getTokenIdFromRequest(req);
            const {ids} = await req.body as {ids: number[]};
            
            // Fazer verificação de ids
            if (!Array.isArray(ids) || ids.length === 0) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            if (!ids.every(id => Number.isInteger(id) && id > 0)) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_DATA));
            }

            // limite de 100 ids na array
            if (ids.length > 100) {
                return res.status(400).send(errorResponse(ResponseApi.Validation.OUT_OF_RANGE));
            }

            const result = await this.notificationModel.markReadMessage(userId, ids);

            return res.status(200).send(successResponse(ResponseApi.Messages.READ_MESSAGES_SUCCESS, {updatedCount: result}));
        }catch(e) {
            console.log(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }

    public async markAllReadMessage(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply>{
        try{
            const userId = await getTokenIdFromRequest(req);

            const result = await this.notificationModel.markAllReadMessage(userId);

            return res.status(200).send(successResponse(ResponseApi.Messages.READ_MESSAGES_SUCCESS, {updatedCount: result}));
        }catch(e) {
            console.log(e);
            return res.status(500).send(errorResponse(ResponseApi.Server.INTERNAL_ERROR));
        }
    }
}