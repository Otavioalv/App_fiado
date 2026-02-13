import axios, { isAxiosError } from 'axios';
import { NetworkError, UnknownError, UnauthorizedError, ForbiddenError, ServerError, InternalError, NotFoundError, BadRequestError } from '../errors/AppError';

const baseURL: string = process.env.EXPO_PUBLIC_API_URL || "";

// Alert.alert("conexao da api Teste: ", baseURL);
// Alert.alert("Teste: ", process.env.EXPO_PUBLIC_TESTE);

let authToken: string | null = null;
let logoutAction: () => void;
let forbiddenAction: () => void;

export const api = axios.create({
    baseURL,
    // baseURL: "http://192.168.1.10:8090",
    timeout: 20000,
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
            // const fakeError = {
            //     isAxiosError: true,
            //     response: {
            //         status: 500,
            //         data: { message: "Simulação de explosão no servidor" }
            //     }
            // };

            // throw fakeError;

            console.log("[Interceptor] Preparando requisição...");
            // Coleta url
            const fullUrl = config.baseURL ? config.baseURL + config.url : config.url;
            console.log("[Interceptor] Destino: ", fullUrl);
            // Verifica token
            if(authToken) {
                console.log(`[Interceptor] Token encontrado. Injetando...`);
                config.headers.Authorization = `Bearer ${authToken}`;
                // config.headers.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTE4LCJub21lIjoibm9tZSIsInVzdWFyaW8iOiJmb3JuZWNlZG9yIiwiaWF0IjoxNzY3MTI1MDgxfQ.jTfm2qlIWiUd-ba-ZGODNId7qbxZmwUHVi7VTCpmxro`;
                // config.headers.Authorization = `Bearer sdfsdafsdf`;
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
                const msg:string|undefined = error.response.data?.message;

                console.log(`[Interceptor Response] Requisição enviada, mas o servidor retornou erro`);
                console.log(`[Interceptor Response] Erro: `, JSON.stringify(error.response.data, null, "  "));
                console.log(`[Interceptor Response] Status: `, status)
                
                console.log("\n");

                switch(status){
                    case 400:
                    case 422: // Editar, pode retornar erro
                        return Promise.reject(new BadRequestError(msg, status));
                    case 401:
                        logoutAction();
                        return Promise.reject(new UnauthorizedError());
                    case 403:
                        forbiddenAction();
                        return Promise.reject(new ForbiddenError());
                    case 404: 
                        return Promise.reject(new NotFoundError(msg));
                    default: 
                        if(status >= 500) {
                            // serverErrorAction()
                            return Promise.reject(new ServerError());
                        }

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
