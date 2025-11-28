import { cliEventNames } from "../../shared/consts/cliEventsNames";
import { typeNotificationList } from "../../shared/consts/typeNotificationList";
import { NotificationsMap } from "../../shared/interfaces/notifierInterfaces";
import { Messages } from "./messages";
// import { NotificationPayload, NotificationsMap, UserDataNotfy } from "../../shared/interfaces/utilsInterfeces";



export const Notifications: NotificationsMap = {
    novaSolicitacaoParceria: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        payload: {
            message: Messages.novaSolicitacaoParceria(data.user),
            created_at: data.created_at,
            type: typeNotificationList.newPartner,
            user: data.user
        }        
    }),
    parceriaAceita: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        payload: {
            message: Messages.parceriaAceita(data.user),
            created_at: data.created_at,
            type: typeNotificationList.newPartner,
            user: data.user
        }        
    }), 
    solicitarCompra: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        payload: {
            message: Messages.novaSolicitacaoCompra({...data.user, compra: data.produtos}),
            created_at: data.created_at,
            type: typeNotificationList.newPartner,
            user: data.user
        }        
    }), 
};
