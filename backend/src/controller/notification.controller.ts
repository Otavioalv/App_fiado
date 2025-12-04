import { FastifyReply, FastifyRequest } from "fastify";
import { queryFilter } from "../shared/interfaces/utilsInterfeces";
import { getTokenIdFromRequest } from "../shared/utils/tokenUtils";
import { MessageInterface, UserType } from "../shared/interfaces/notifierInterfaces";
import { verifyQueryOptList } from "../shared/utils/verifyQueryOptList";
import { errorResponse, successResponse } from "../common/responses/api.response";
import { NotificationModel } from "../models/notification.model";
import { ResponseApi } from "../shared/consts/responseApi";

export class NotificationController {
    private notificationModel: NotificationModel = new NotificationModel();

    public async listMessages(req: FastifyRequest, res: FastifyReply, userType: UserType): Promise<FastifyReply> { 
        try {
            const {...filterOpt} = req.query as queryFilter;
            const id:number = await getTokenIdFromRequest(req);


            if(!filterOpt.search)
                filterOpt.search = "";

            if(!await verifyQueryOptList(filterOpt))
                return res.status(400).send(errorResponse(ResponseApi.Validation.INVALID_FILTER));

            if(!id) {
                return res.status(404).send(errorResponse(ResponseApi.Messages.LIST_ERROR));
            }

            const listMsg: MessageInterface[] = await this.notificationModel.getNotification(id, userType, filterOpt);
            

            // return res.status(200).send(successResponse("Listado com sucesso", {list: listPartner, pagination: filterOpt}));
            return res.status(200).send(successResponse(ResponseApi.Messages.LIST_SUCCESS, {list: listMsg, paginetion: filterOpt}));

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
}