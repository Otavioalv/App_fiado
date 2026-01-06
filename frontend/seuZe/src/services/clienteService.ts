import { DefaultRegisterSchema } from "../schemas/DefaultRegisterSchema";
import { LoginSchema } from "../schemas/LoginSchema";
import { api } from "./api";
import { responseAxiosInterfaces } from "./typesApi";
import { ClienteDataType, PaginationType, PartnerFornecedorType, ResultsWithPagination, ShoppingData } from "../types/responseServiceTypes";


const defaultEndPoint:string = "/cliente"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        const endPoint = defaultEndPoint + "/login"
        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;
        return response.data.data!.token;
    }catch(error){
        throw error;
    }
}

export async function register(userData: DefaultRegisterSchema): Promise<boolean>{
    try {
        const {confirmarSenha, ...dataToUser} = userData;
        const endPoint = defaultEndPoint + "/register"
        // const response = await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;
        await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        return true;
    }catch(error){
        throw error
    }
}   


export async function me(): Promise<ClienteDataType>{
    try {
        const endPoint = defaultEndPoint + "/me";
        
        // await api.get("/user/delay_test/20000");
        const response = await api.post(endPoint) as responseAxiosInterfaces<ClienteDataType>;
        
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
        }) as responseAxiosInterfaces<ResultsWithPagination<ShoppingData[]>>;
        // as responseAxiosInterfaces<{list: ShoppingData[]} & PaginationResponseType>
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
        }) as responseAxiosInterfaces<ResultsWithPagination<PartnerFornecedorType[]>>;
        // as responseAxiosInterfaces<{list: PartnerFornecedorType[]} & PaginationResponseType>;
        return response.data.data!;
    }catch(err:any){
        throw err
    }
}

export async function listAllFornecedores(pagination: PaginationType = {page: 1, size: 20}): Promise<ResultsWithPagination<PartnerFornecedorType[]>> {
    try {
        const endPoint = defaultEndPoint + "/list-fornecedores";

        const response = await api.post(endPoint, {}, {
            params: {
                ...pagination
            }
        }) as responseAxiosInterfaces<ResultsWithPagination<PartnerFornecedorType[]>>;

        // console.log(JSON.stringify(response.data.data?.list[0], null, "  "));

        return response.data.data!;
    }catch(err: any) {
        throw err;
    }
}
