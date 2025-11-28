import { FastifyInstance } from "fastify";
import { compraInterface } from "./productInterface";

export type NotificationFn<TInput, TOutput> = (input: TInput) => TOutput;

// export type NotificationsMap<TInput, TOutput> = Record<string, NotificationFn<TInput, TOutput>>;
export type NotificationsMap = {
    novaSolicitacaoParceria: NotificationFn<NotificationInput, NotifierToUserParams>;
    parceriaAceita: NotificationFn<NotificationInput, NotifierToUserParams>;
    solicitarCompra: NotificationFn<NotificationCompraInput, NotifierToUserParams>;
};

export interface NotificationCompraInput extends NotificationInput {
    produtos: compraInterface[];
}



export interface UserDataNotfy {
    id: number;
    nome: string;
    apelido?: string;
}

// ---------------------------------------------------

export interface NotificationPayloadAndInput {
    user: UserDataNotfy;
    created_at: Date;
}   

export interface NotificationPayload extends NotificationPayloadAndInput {
    type: string;
    message: string;
}

export interface NotificationInput extends NotificationPayloadAndInput {
    toId: string,
    fromUserType: UserType;
    toUserType: UserType;
}

// ---------------------------------------------------



export interface NotifierBroadcastParams {
    event: string;
    payload: NotificationPayload;
}

export interface NotifierToUserParams extends NotifierBroadcastParams{
    toId: string;
}

export type UserType = "cliente" | "fornecedor" | "all" | "system";


export interface TypeNotification {
    newPartner: string
    acceptedPartner: string
}

// Menssagens
export interface MessageCompraInterface extends UserDataNotfy {
    compra: compraInterface[]
}

export type MessageFn<TInput, TOutput> = (input: TInput) => TOutput;
export type MessageMap = {
    novaSolicitacaoParceria: MessageFn<UserDataNotfy, string>;
    parceriaAceita: MessageFn<UserDataNotfy, string>
    novaSolicitacaoCompra: MessageFn<MessageCompraInterface, string>
}

// Tipo da função notify
export type NotifyReturn = {
    toUser: ({toId, event, payload}:NotifierToUserParams) => void,
    broadcast: ({event, payload}: NotifierBroadcastParams) => void
}

export type Notify = (app: FastifyInstance) => NotifyReturn;

// Tipo do notification model
export interface MessageInterface {
    mensagem: string, 
    created_at: Date, 
    from_user_id: number, 
    to_user_id: number,
    from_user_type: UserType,
    to_user_type: UserType, 
    type: string
};
