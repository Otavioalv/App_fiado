import { cliEventNames } from "../../shared/consts/cliEventsNames";
import { typeNotificationList } from "../../shared/consts/typeNotificationList";
import { NotificationsMap } from "../../shared/interfaces/notifierInterfaces";
import { Messages } from "./messages";
// import { NotificationPayload, NotificationsMap, UserDataNotfy } from "../../shared/interfaces/utilsInterfeces";

export const Notifications: NotificationsMap = {
    novaSolicitacaoParceria: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.novaSolicitacaoParceria(data.user),
            type: typeNotificationList.newPartner.type,
            title: typeNotificationList.newPartner.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }),
    parceriaAceita: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.parceriaAceita(data.user),
            type: typeNotificationList.acceptedPartner.type,
            title: typeNotificationList.acceptedPartner.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }), 
    solicitarCompra: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.novaSolicitacaoCompra({...data.user, compra: data.produtos}),
            type: typeNotificationList.purchaseRequest.type,
            title: typeNotificationList.purchaseRequest.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }), 
    aceitarCompra: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.aceitarCompra(data.user),
            type: typeNotificationList.purchaseAccepted.type,
            title: typeNotificationList.purchaseAccepted.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }), 
    recusarCompra: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.recusarCompra(data.user),
            type: typeNotificationList.purchaseRejected.type,
            title: typeNotificationList.purchaseRejected.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }), 
    atualizarCompra: (data) => ({
        toId: data.toId,
        event: cliEventNames.newMessage,
        userType: data.toUserType,
        payload: {
            message: Messages.atualizarCompra(data.user),
            type: typeNotificationList.purchaseUpdated.type,
            title: typeNotificationList.purchaseUpdated.title,
            created_at: data.created_at,
            user: data.user,
        }        
    }),
};
