import { FornecedorRegisterSchema } from "../schemas/FornecedorRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { responseAxiosInterfaces } from "./typesApi";

const defaultEndPoint:string = "/fornecedor"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        const endPoint = defaultEndPoint + "/login"
        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;
        // Toast.show({
        //     type: "success",
        //     text1: "Bem-vindo(a)!",
        //     text2: "Login realizado com sucesso"
        // });
        return response.data.data!.token;
    }catch(error){
        throw error;
    }
}

export async function register(userData: FornecedorRegisterSchema): Promise<boolean>{
    try {
        const {confirmarSenha, ...dataToUser} = userData;
        const endPoint = defaultEndPoint + "/register"
        // const response = await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;
        // console.log("RESPOSTA: ", response.data);
        
        await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        return true;
    }catch(error){
        throw error
    }
}   
