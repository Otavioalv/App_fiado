import axios from 'axios';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";

Alert.alert("conexao da api Teste: ", baseURL);
Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

let authToken: string | null = null;
let logoutAction: () => void = () => {}; 

export const api = axios.create({
    baseURL,
    timeout: 15000,
    // headers: {"Content-Type": "application/json"}
});

export const setAuthToken = (token: string | null) => {
    authToken = token;
}

export const registerLogoutAction = (fn: () => void) => {
    logoutAction = fn;
}

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
        
        
        // const token = await SecureStore.getItemAsync("user_token");
        // if(authToken) {
        //     config.headers.Authorization = `Bearer ${authToken}`;
        // }
        // return config;

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
        console.log(`[Interceptor Response] Reparando resposta de erro...`);
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
            
        return Promise.reject(error);
    }
);
