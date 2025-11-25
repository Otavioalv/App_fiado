import { cliEventNames } from "../../shared/consts/cliEventsNames";

type NotificationFn<TInput, TOutput> = (input: TInput) => TOutput;

type NotificationsMap<TInput, TOutput> = Record<string, NotificationFn<TInput, TOutput>>;


interface UserData {
    id: number;
    nome: string;
    apelido?: string;
}

interface NotificationPayload {
    type: string;
    message: string;
    user: UserData;
}



export const Notifications: NotificationsMap<UserData, NotificationPayload> = {
    novaSolicitacaoParceria: (userData) => ({
        type: cliEventNames.newPartner, 
        message: `Você recebeu uma nova solicitação de parceria de ${userData.nome}${userData.apelido ? ` conhecido por ${userData.apelido}.` : "."}`,
        user: {
            ...userData
        }        
    }),

    novaCompra: (userData) => ({
        type: cliEventNames.newCharge, 
        message: `Você recebeu uma nova solicitação de parceria de ${userData.nome}${userData.apelido ? ` conhecido por ${userData.apelido}.` : "."}`,
        user: userData  
    })

};

