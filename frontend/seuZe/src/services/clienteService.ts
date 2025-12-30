import { DefaultRegisterSchema } from "../schemas/DefaultRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { responseAxiosInterfaces } from "./typesApi";
import { DefaultUserDataType, PaginationResponseType, PaginationType, PartnerFornecedorType, ResultsWithPagination, ShoppingData } from "../types/responseServiceTypes";


const defaultEndPoint:string = "/cliente"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        console.log("CLIENTE");
        
        const endPoint = defaultEndPoint + "/login"
        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;
        return response.data.data!.token;
    }catch(error){
        throw error;
    }
}

export async function register(userData: DefaultRegisterSchema) {
    try {
        const {confirmarSenha, ...dataToUser} = userData;

        const endPoint = defaultEndPoint + "/register"

        const response = await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        console.log("RESPOSTA: ", response.data);

    }catch(error){
        throw error
    }
}   


export async function me(): Promise<DefaultUserDataType>{
    try {
        const endPoint = defaultEndPoint + "/me";
        
        // await api.get("/user/delay_test/20000");
        const response = await api.post(endPoint) as responseAxiosInterfaces<DefaultUserDataType>;
        
        return response.data.data!;
    }catch(err:any){
        throw err
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
        return response.data.data!;
    }catch(err:any){
        throw err
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
        return response.data.data!;
    }catch(err:any){
        throw err
    }
}
