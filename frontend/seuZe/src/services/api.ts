import axios from 'axios';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";

Alert.alert("conexao da api Teste: ", baseURL);
Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

let authToken: string | null = null;
let logoutAction: () => void = () => {}; 
let apiCnn: boolean = true;

export const api = axios.create({
    baseURL,
    timeout: 100000,
    // headers: {"Content-Type": "application/json"}
});

export const setAuthToken = (token: string | null) => {
    authToken = token;
}

export const registerLogoutAction = (fn: () => void) => {
    logoutAction = fn;
}

export const setApiCnn = (cnn: boolean) => {
    apiCnn = cnn;
};

// gancho q age de forma automatica a toda requisição
api.interceptors.request.use(
    async (config) => {
        try {
            console.log("[Interceptor] Preparando requisição...");
            // Coleta url
            const fullUrl = config.baseURL ? config.baseURL + config.url : config.url;
            console.log("[Interceptor] Destino: ", fullUrl);
            // Verifica token
            if(authToken) {
                console.log(`[Interceptor] Token encontrado. Injetando...`);
                config.headers.Authorization = `Bearer ${authToken}`;
            } else {
                console.log("[Interceptor] AVISO: Token é NULL/Vazio nesta requisição");
            }
            
            console.log("\n");
            return config;
        }catch(err){
            console.log(`[Interceptor] ERRO FATAL AO CONFIGURAR: `, err);
            throw err;
        }
    }, 
    // Fazer verificação melhor
    (error) => {
        console.log(`[Interceptor] Erro na saída: `, error);
        return Promise.reject(error)
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log(`[Interceptor Response] Houve um erro...`);
        
        // Erro de rede
        if(!error?.response) {
            console.log(`[Interceptor Response] Error sem resposta (timeout ou rede)...`);
            console.log(`[Interceptor Response] Erro: `, error)

            return Promise.reject(error); 
        }

        const status = error?.response.status;

        console.log("[Interceptor Response] Status: ", status);

        if(status === 401) {
            console.log("[Interceptor Response] Token expirado ou invalido, Realizando logout");
            logoutAction();
        }

        if(status === 403) {
            console.log("[Interceptor Response] Acesso negado, token invalido ou não fornecido");
           Toast.show({
                type: "error",
                text1: "Acesso negado",
                text2: "Você não tem permissão para essa ação",
           }); 
        }

        /* 
    const dataErr = errorAxios.response?.data;
                const {status} = errorAxios.response;
    
                if(status === 401)
                    throw new UnauthorizedError();
    
                if(status >= 400 && status < 500) {
                    // Toast.show({
                    //     type: dataErr.status,
                    //     text1: dataErr.message,
                    //     // text2: "Mensagem de erro"
                    // });
                    throw new AppError(dataErr.message, "CLIENT");
    
                } else if(status >= 500) {
                    // Toast.show({
                    //     type: dataErr.status,
                    //     text1: dataErr.message,
                    //     text2: "Tente novamente mais tarde"
                    // });
                    throw new ServerError();
                }    
         */
            
        return Promise.reject(error);
    }
);
