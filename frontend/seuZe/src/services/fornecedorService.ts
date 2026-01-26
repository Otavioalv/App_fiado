import { FornecedorRegisterSchema } from "../schemas/FornecedorRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { responseAxiosInterfaces } from "./typesApi";

const defaultEndPoint:string = "/fornecedor"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        const endPoint = defaultEndPoint + "/login"
        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;
        
        return response.data.data!.token;
    }catch(error){
        throw error;
    }
}

export async function register(userData: FornecedorRegisterSchema): Promise<boolean>{
    try {
        const {confirmarSenha, ...dataToUser} = userData;
        const endPoint = defaultEndPoint + "/register";

        await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        return true;
    }catch(error){
        throw error
    }
}   
