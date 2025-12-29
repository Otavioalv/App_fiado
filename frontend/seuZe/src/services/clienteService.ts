import { Alert } from "react-native";
import { DefaultRegisterSchema } from "../schemas/DefaultRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { errorAxiosInterface, responseAxiosInterfaces } from "./typesApi";

import Toast from "react-native-toast-message";
import { DefaultUserDataType, PaginationResponseType, PaginationType, PartnerFornecedorType, ResultsWithPagination, ShoppingData } from "../types/responseServiceTypes";


const defaultEndPoint:string = "/cliente"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        console.log("CLIENTE");
        
        const endPoint = defaultEndPoint + "/login"
        
        Alert.alert("login cliente endpoint: ", endPoint);

        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;

        console.log("RESPOSTA: ", response.data.data);

        Toast.show({
            type: "success",
            text1: "Bem-vindo(a)!",
            text2: "Login realizado com sucesso"
        });

        console.log(response.data.data);
        return response.data.data!.token;
    }catch(error){
        const err = error as errorAxiosInterface

        if(err.response){
            const dataErr = err.response?.data;
            const {status} = err.response

            console.log("houve um erro: ", JSON.stringify(dataErr, null, 2));
            
            
            if(status >= 400 && status < 500) {
                Toast.show({
                    type: "error",
                    text1: "Erro ao efetuar login",
                    text2: dataErr.message
                });
            } else if(status >= 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    text2: "Tente novamente mais tarde"
                });
            }
        }else{ 
            Toast.show({
                type: "error",
                text1: "Erro desconhecido",
                text2: "Verifique sua conexão com a internet"
            });

            console.log("Erro de conexão: ", err.message);
        }

        return null;
    }
}

export async function register(userData: DefaultRegisterSchema) {
    try {
        const {confirmarSenha, ...dataToUser} = userData;

        const endPoint = defaultEndPoint + "/register"

        const response = await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        console.log("RESPOSTA: ", response.data);

        Toast.show({
            type: "success",
            text1: "Bem-vindo(a)!",
            text2: "Login realizado com sucesso (fazer login automatico)"
        });

    }catch(error){
        const err = error as errorAxiosInterface

        if(err.response){
            const dataErr = err.response?.data;
            const {status} = err.response;

            console.log("houve um erro: ", JSON.stringify(dataErr, null, 2));
            console.log(status);



            if(status >= 400 && status < 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    // text2: "Mensagem de erro"
                })
            } else if(status >= 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    text2: "Tente novamente mais tarde"
                })
            }
        }else{ 
            Toast.show({
                type: "error",
                text1: "Erro desconhecido",
                text2: "Verifique sua conexão com a internet"
            });
            
            console.log("Erro de conexão: ", err.message);
        }
    }
}   


export async function me(): Promise<DefaultUserDataType>{
    try {
        const endPoint = defaultEndPoint + "/me";
        
        const response = await api.post(endPoint) as responseAxiosInterfaces<DefaultUserDataType>;

        return response.data.data!;
    }catch(error){
        const err = error as errorAxiosInterface;


        console.log("[cliente ME] Inicion catch");
        // Erro de codigo
        if(!err.isAxiosError){
            console.log(`[cliente ME] Erro interno do APP`);
            console.log(`[cliente ME] Menssagem Axios: `, err.message);
            console.log(`[cliente ME] Stack: `, err.stack);
            return {nome: "", telefone: ""}
        }

        // Erro do axios
        if(err.response){
            console.log(`[cliente ME] Backend Respondeu`);
            console.log(`[cliente ME] Status: `, err.response.status);
            console.log(`[cliente ME] Detalhes do erro: `, JSON.stringify(err.response.data, null, 2));

            const dataErr = err.response?.data;
            const {status} = err.response;

            if(status >= 400 && status < 500) {
                console.log("entrou no toast");
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    // text2: "Mensagem de erro"
                });
            } else if(status >= 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    text2: "Tente novamente mais tarde"
                });
            }
        }
        // Erro de rede
        else if(err.request){ 
            console.log(`[cliente ME] requisição saiu mas servidor não respondeu`);
            console.log(`[cliente ME] Menssagem Erro: `, err.message);

            Toast.show({
                type: "error",
                text1: "Erro desconhecido",
                text2: "Verifique sua conexão com a internet"
            });
            
            console.log("Erro de conexão: ", err.message);
        }
        // Erro na configuração requisição
        else {
            console.log(`[cliente ME] Erro ao configurar requisição antes de enviar.`);
            console.log(`[cliente ME] Menssagem de erro: `, err.message);
        }

        console.log(`[cliente ME] Fim catch \n`);

        return {nome: "", telefone: ""};
    }
}



export async function shoppingList(pagination: PaginationType = {page: 1, size: 10}): Promise<ResultsWithPagination<ShoppingData[]>>{
    try {
        const endPoint = defaultEndPoint + "/product/buy/list";
        
        const response = await api.post(endPoint, {}, {
            params: {
                ...pagination
            }
        }) as responseAxiosInterfaces<{list: ShoppingData[]} & PaginationResponseType>;

        // console.log(JSON.stringify(response.data?.data, null, 2));
        
        return response.data.data!;
    }catch(error){
        const err = error as errorAxiosInterface;
        
        if(err.response){
            const dataErr = err.response?.data;
            const {status} = err.response;
            
            console.error("houve um erro: ", JSON.stringify(dataErr, null, 2));
            console.log(status);

            if(status >= 400 && status < 500) {
                console.error(dataErr.message);
            } else if(status >= 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    text2: "Tente novamente mais tarde"
                });
            }
        }else{ 
            Toast.show({
                type: "error",
                text1: "Erro desconhecido",
                text2: "Verifique sua conexão com a internet"
            });
            
            console.log("Erro de conexão: ", err.message);
        }

        return {list: []};
    }
}

export async function partnarSent(pagination: PaginationType = {page: 1, size: 10}): Promise<ResultsWithPagination<PartnerFornecedorType[]>>{
    try {
        const endPoint = defaultEndPoint + "/partner/list/sent";
        
        const response = await api.post(endPoint, {}, {
            params: {
                ...pagination
            }
        }) as responseAxiosInterfaces<{list: PartnerFornecedorType[]} & PaginationResponseType>;

        // console.log(JSON.stringify(response.data?.data, null, 2));
        
        return response.data.data!;
    }catch(error){
        const err = error as errorAxiosInterface;
        
        if(err.response){
            const dataErr = err.response?.data;
            const {status} = err.response;
            
            console.error("houve um erro: ", JSON.stringify(dataErr, null, 2));
            console.log(status);

            if(status >= 400 && status < 500) {
                console.error(dataErr.message);
            } else if(status >= 500) {
                Toast.show({
                    type: dataErr.status,
                    text1: dataErr.message,
                    text2: "Tente novamente mais tarde"
                });
            }
        }else{ 
            Toast.show({
                type: "error",
                text1: "Erro desconhecido",
                text2: "Verifique sua conexão com a internet"
            });
            
            console.log("Erro de conexão: ", err.message);
        }

        return {list: []};
    }
}
