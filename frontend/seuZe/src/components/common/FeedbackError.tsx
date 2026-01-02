import { ErrorTypes } from "@/src/types/responseServiceTypes";
import FeedbackTemplate, { FeedbackTemplateProps } from "./FeedbackTemplate";

export interface FeedBackErrorProps {
    errorType: ErrorTypes,
    onAction: () => void
}

type ConfigType = FeedbackTemplateProps & {buttonText: string};

export type FeedBackErrorconfigType = Record<ErrorTypes, ConfigType>;

const errorConfig:FeedBackErrorconfigType = {
    NETWORK: {
        iconName: "wifi-off",
        title: "Sem Conexão",
        description: "Parece que você está offline ou sua internet está lenta. Verifique sua conexão e tente novamente",
        buttonText: "Tentar Novamente",
    },
    SERVER: {
        iconName: "cloud-off",
        title: "Erro interno no servidor",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
        buttonText: "Tentar Novamente",
    },
    FORBIDDEN: {
        iconName: "lock",
        title: "Acesso Negado",
        description: "Para acessar o app, por favor, faça login em sua conta correta",
        buttonText: "Acesso Negado",

    },
    UNKNOWN: {
        iconName: "meh",
        title: "Algo deu errado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
        buttonText: "Voltar ao Início",
    },

    // EDITAR
    CLIENT: {
        iconName: "meh",
        title: "Algo deu errado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
        buttonText: "Voltar ao Início",
    },
    INTERNAL: {
        iconName: "meh",
        title: "Algo deu errado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
        buttonText: "Voltar ao Início",
    },
    UNAUTHORIZED: {
        iconName: "meh",
        title: "Algo deu errado",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde",
        buttonText: "Voltar ao Início",
    }
}


export default function FeedbackError({errorType, onAction}: FeedBackErrorProps) {
    const content:ConfigType = errorConfig[errorType];

    return (
        <FeedbackTemplate
            iconName={content.iconName}
            title={content.title}
            description={content.description}
            primaryAction={{
                label: content.buttonText,
                onPress: onAction
            }}
        />
    )
}