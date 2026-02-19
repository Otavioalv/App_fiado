import { NotificationPayload } from "../interfaces/notifierInterfaces";

export type TypeNotification = "new_partner" | "accepted_partner" | "purchase_request" | "purchase_accepted" | "purchase_rejected" | "purchase_updated";

interface ItemNotificationType {
    type: TypeNotification,
    title: string,
}

type NotificationListType = Record<string, ItemNotificationType>;


export const typeNotificationList: NotificationListType = {
    newPartner: {
        type: "new_partner", 
        title: "Notificação de parceria",
    },
    acceptedPartner: {
        type: "accepted_partner", 
        title: "Parceria aceita",
    },
    purchaseRequest: {
        type: "purchase_request", 
        title: "Nova solicitação de compra",
    },
    purchaseAccepted: {
        type: "purchase_accepted", 
        title: "Compra aceita",
    },
    purchaseRejected: {
        type: "purchase_rejected", 
        title: "Compra recusada",
    },
    purchaseUpdated: {
        type: "purchase_updated", 
        title: "Atualização de compra",
    },
} as const;
