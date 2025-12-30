import axios, { isAxiosError } from 'axios';
import { NetworkError } from '../errors/NetworkError';
import { UnknownError } from '../errors/UnknownError';
import { UnauthorizedError } from '../errors/UnauthorizedError';
import { ForbiddenError } from '../errors/ForbidenError';
import { ServerError } from '../errors/ServerError';
import { InternalError } from '../errors/InternalError';

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";

// Alert.alert("conexao da api Teste: ", baseURL);
// Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

let authToken: string | null = null;
let logoutAction: () => void;
let forbiddenAction: () => void;

export const api = axios.create({
    baseURL,
    timeout: 10000,
    headers: {"Content-Type": "application/json"}
});

export const setAuthToken = (token: string | null) => {
    authToken = token;
}

export const registerLogoutAction = (fn: () => void) => {
    logoutAction = fn;
}

export const registerForbiddenAction = (fn: () => void) => {
    forbiddenAction = fn;
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
                // config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4LCJub21lIjoibm9tZSIsInVzdWFyaW8iOiJmb3JuZWNlZG9yIiwiaWF0IjoxNzY3MTI1MDgxfQ.jTfm2qlIWiUd-ba-ZGODNId7qbxZmwUHVi7VTCpmxro`;
                config.headers.Authorization = `Bearer sdfsdafsdf`;
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
    (error: unknown) => {
        console.log(`[Interceptor Response] Houve um erro...`);

        if(isAxiosError(error)) {
            if(error.response) {
                const {status} = error.response;

                console.log(`[Interceptor Response] Requisição enviada, mas o servidor retornou erro`);
                console.log(`[Interceptor Response] Erro: `, JSON.stringify(error.response.data, null, "  "));
                
                console.log("\n");

                switch(status){
                    case 400:
                    case 422:
                        return Promise.reject(error);
                    case 403: // 401
                        logoutAction();
                        return Promise.reject(new UnauthorizedError());
                    case 401: // 403
                        forbiddenAction();
                        return Promise.reject(new ForbiddenError());
                    default: 
                        if(status >= 500)
                            return Promise.reject(new ServerError());

                        // Qualquer erro 4xx, (agr n tratar)
                        return Promise.reject(new UnknownError());
                }
            } 
            // Nenhuma resposta recebida do servidor
            else if (error.request) {
                console.log(`[Interceptor Response] Requisição enviada, mas serivdor não retornou resposta`);
                console.log(`[Interceptor Response] Erro: `, error.request.code);
                console.log(`[Interceptor Response] Cause: `, error.request.status);

                console.log("\n");
                /* ERR_NETWORK */

                return Promise.reject(new NetworkError()); 
            } 
            // Configuração da requisição/codigo
            else {
                console.log(`[Interceptor Response] Erro de configuração ao enviar requisição, ou erro no codigo interno`);
                console.log(`[Interceptor Response] Erro: `, error);
                console.log("\n");
                return Promise.reject(new InternalError());
            }
        }
        
        // Erro do codigo
        console.log(`[Interceptor Response] Erro em alguma parte do codigo`);
        console.log(`[Interceptor Response] Erro: `, error);
        console.log("\n");
        return Promise.reject(new UnknownError());
    }
);
