import { Alert } from "react-native";
import { DefaultRegisterSchema } from "../schemas/DefaultRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { errorAxiosInterface, responseAxiosInterfaces } from "./typesApi";


import Toast from "react-native-toast-message";



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
            
            console.log("houve um erro: ", JSON.stringify(dataErr, null, 2));
            
            Toast.show({
                type: "error",
                text1: "Erro ao efetuar login",
                text2: dataErr.message
            })
        }
        else
            console.log("Erro de conexão: ", err.message);

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
            console.log(JSON.stringify(err.response.status, null, 2));



            if(status <= 400) {
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
        }
        else
            console.log("Erro de conexão: ", err.message);
    }
}   


export async function me(){
    try {
        const endPoint = defaultEndPoint + "/me";

        const response = await api.post(endPoint);

        console.log("RESPOSTA: ", response.data.data);

        console.log(response.data.data);
    }catch(error){
        const err = error as errorAxiosInterface

        if(err.response){
            const dataErr = err.response?.data;
            
            console.log("houve um erro: ", JSON.stringify(dataErr, null, 2));
        }
        else
            console.log("Erro de conexão: ", err.message);
    }
}
