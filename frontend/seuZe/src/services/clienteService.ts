import { BasicFormSchema, DefaultRegisterSchema, LoginSchema } from "../schemas/FormSchemas";
import { api } from "./api";
import { BackendResponse, responseAxiosInterfaces } from "./typesApi";
import { ClienteDataType, TypeUserList, PaginationType, PartnerFornecedorType, ResultsWithPagination, ShoppingData, ProductAndFornecedorData, TypeShoppingList } from "../types/responseServiceTypes";
import { ShoppingListParams } from "./types/clienteServiceParams";


const defaultEndPoint:string = "/cliente"

export async function login(userData: LoginSchema): Promise<string | null>{
    try {
        const endPoint = defaultEndPoint + "/login"
        const response = await api.post(endPoint, userData) as responseAxiosInterfaces<{token: string}>;
        return response.data.data!.token;
    }catch(error){
        /* 
        if(err instanceof AppError){
            const {message} = err;
            
            Toast.show({
                type: "error",
                text1: message,
                text2: "Por favor tente novamente"
            })
        }else {
            Toast.show({
                type: "error",
                text1: "Recurso não encontrado",
                text2: "Por favor tente novamente"
            });
        }
        */

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

export async function update(updtData: BasicFormSchema): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/update";
        // const response = await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;
        await api.post(endPoint, updtData) as responseAxiosInterfaces<null>;

        return true;
    }catch(error){
        throw error
    }
}

export async function productList(
    listType: TypeUserList,
    idFornecedor?: string | number,
    idProduct?: string | number,
    pagination: PaginationType = {page: 1, size: 10}
): Promise<ResultsWithPagination<ProductAndFornecedorData[]>>{
    try {
        const endPoint = defaultEndPoint + "/product/list/" + listType;
        
        const response = await api.get(endPoint, {
            params: {
                idFornecedor: idFornecedor,
                idProduct: idProduct,
                ...pagination
            }
        }) as responseAxiosInterfaces<ResultsWithPagination<ProductAndFornecedorData[]>>;
          
        return response.data.data!;
    }catch(err:any){
        throw err
    }
}


export async function shoppingList({
    pagination = {page: 1, size: 10}, 
    listType,
    idCompra,
    idFornecedor,
}: ShoppingListParams): Promise<ResultsWithPagination<ShoppingData[]>>{
    try{
        const endPoint = defaultEndPoint + "/product/buy/list/" + listType;
        
        const response = await api.get(endPoint, {
            params: {
                toIdUser: idFornecedor,
                idCompra: idCompra,
                ...pagination
            }
        }) as responseAxiosInterfaces<ResultsWithPagination<ShoppingData[]>>;
        
        // console.log(JSON.stringify(response.data.data, null, "  "));
        

        return response.data.data!;
    }catch(err: any){
        throw err;
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

export async function listPartner(
    listType: TypeUserList, 
    id?: string | number,
    pagination: PaginationType = {
        page: 1, 
        size: 10
    },  
): Promise<ResultsWithPagination<PartnerFornecedorType[]>>{
    try {
        const endPoint = `${defaultEndPoint}/partner/list/${listType}`;
        // const endPoint = id ? `${resourcePath}/${id}` : resourcePath;

        console.log("[IDFORNECEDOR SERVICE: ]", id);

        const response = await api.get<BackendResponse<ResultsWithPagination<PartnerFornecedorType[]>>>(endPoint, {
            params: {
                idFornecedor: id,
                ...pagination,
                
            }
        });
        // console.log(JSON.stringify(response, null, "  "));

        if(!response.data.data) {
            return {list: [], pagination: pagination}
        }

        return response.data.data;
        
    }catch(err: any){
        throw err;
    }
}

// Aceita parceria
export async function acceptPartner(idFornecedor: string | number): Promise<boolean>{
    try {
        const endPoint = `${defaultEndPoint}/partner/accept`;
        
        const data = {
            idPartner: Number(idFornecedor),
        }
        console.log(data);

        const response = await api.post(endPoint, data);
        console.log("RESPONPSE: ", JSON.stringify(response.data, null, "  "));

        return true;
    }catch(err: any){
        throw err;
    }
}

// Enviar solicitação de parceria
export async function requestPartner(idFornecedor: string | number) {
    try {
        const endPoint = `${defaultEndPoint}/partner`;
        
        const data = {
            ids: [Number(idFornecedor)],
        };
        console.log(data);

        const response = await api.post(endPoint, data);

        // console.log(response);

        return true;
    }catch(err: any){
        throw err;
    }
}

export async function rejectPartner(idFornecedor: string | number) {
    try {
        const endPoint = `${defaultEndPoint}/partner/reject`;
        
        const data = {
            idPartner: Number(idFornecedor),
        };
        // console.log("reject: ", data);

        const response = await api.post(endPoint, data);

        // console.log(response);

        return true;
    }catch(err: any){
        throw err;
    }
} 
