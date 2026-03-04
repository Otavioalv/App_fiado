import { FornecedorRegisterSchema, FornecedorUpdateSchema, LoginSchema, ProdutosAddFormType, ProdutoSimpleFormShema } from "../schemas/FormSchemas";
import { DataUpdateBuyType, FornecedorDataType, NotificationInterface, PaginationType, PartnerClienteType, ProdutoInterface, ResultsWithPagination, ShoppingDataFornecedor, TypeMessageList } from "../types/responseServiceTypes";
import { api } from "./api";
import { ShoppingListParams } from "./types/clienteServiceParams";
import { ListPartnerParams } from "./types/serviceParams";
import { BackendResponse, responseAxiosInterfaces } from "./typesApi";

interface ListMessagesParams {
    listType: TypeMessageList, 
    pagination: PaginationType,
    id?: string | number,
}

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

        console.log(JSON.stringify(dataToUser, null, "  "));
        await api.post(endPoint, dataToUser) as responseAxiosInterfaces<{token: string}>;

        return true;
    }catch(error){
        throw error
    }
}

export async function me(): Promise<FornecedorDataType|undefined>{
    try {
        const endPoint = defaultEndPoint + "/me";

        const response = await api.post<BackendResponse<FornecedorDataType>>(endPoint);

        return response.data.data;
    }catch(err: any) {
        throw err;
    }
}

export async function update(updtData: FornecedorUpdateSchema): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/update";

        await api.put(endPoint, updtData) as responseAxiosInterfaces<null>;

        return true;
    }catch(error){
        throw error
    }
}

export async function shoppingList({
    pagination={page: 1, size: 10},
    listType,
    idCompra,
    idToUser,
}: ShoppingListParams): Promise<ResultsWithPagination<ShoppingDataFornecedor[]>>{
    try{
        const endPoint = defaultEndPoint + "/product/buy/list/" + listType;

        const response = await api.get<BackendResponse<ResultsWithPagination<ShoppingDataFornecedor[]>>>(endPoint, {
            params: {
                toIdUser: idToUser,
                idCompra: idCompra,
                ...pagination,
            }
        })


        if(!response.data.data){
            return {
                list: [],
                pagination: pagination
            };
        }

        // console.log(JSON.stringify(response.data.data, null, "  "));

        return response.data.data;
    }catch(err: any) {
        throw err;
    }
};




export async function listPartner({
    listType, 
    id,
    pagination = {
        page: 1, 
        size: 10
    }, 
}:ListPartnerParams): Promise<ResultsWithPagination<PartnerClienteType[]>>{
    try {
        const endPoint = `${defaultEndPoint}/partner/list/${listType}`;

        console.log(listType, id, pagination);

        console.log("[IDFORNECEDOR SERVICE: ]", id);

        const response = await api.get<BackendResponse<ResultsWithPagination<PartnerClienteType[]>>>(endPoint, {
            params: {
                idCliente: id,
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


export async function listMessages({
    listType,
    id,
    pagination = {page: 1, size: 20},
}: ListMessagesParams): Promise<ResultsWithPagination<NotificationInterface[]>> {
    try{
        const endPoint = `${defaultEndPoint}/message/list/` + listType;

        console.log("[ID MENSAGEM SERVICE]: ", Number(id) || null);

        const response = await api.get<BackendResponse<ResultsWithPagination<NotificationInterface[]>>>(endPoint, {
            params: {
                idMensagem: Number(id) || null, // Transformar temporariamente para numero
                ...pagination
            }
        });

        if(!response.data.data) {
            return {list: [], pagination: pagination}
        }

        return response.data.data
    }catch(err: any){
        throw err;
    }
}

export async function markReadAllNotifications(): Promise<boolean>{
    try {   
        const endPoint = `${defaultEndPoint}/message/mark-all-read`;
        // console.log("Lista de ids", listIds);
        
        const response = await api.put<BackendResponse<ResultsWithPagination<null>>>(endPoint);

        return true;
    } catch(err: any) {
        throw err;
    }
}


export async function deleteNotification(listIds: number[]):Promise<boolean>{
    try {
        const endPoint = `${defaultEndPoint}/message/delete`;
        // console.log("Lista de ids", listIds);
        
        const response = await api.post<BackendResponse<ResultsWithPagination<null>>>(endPoint, listIds);

        return true;
    } catch(err: any){
        throw err;
    }
}

export async function markReadNotification(listIds: number[]): Promise<boolean>{
    try {
        const endPoint = `${defaultEndPoint}/message/mark-read`;

        const data = {
            ids: listIds
        }
        // console.log("Lista de ids", listIds);
        
        const response = await api.post<BackendResponse<ResultsWithPagination<null>>>(endPoint, data);

        return true;
    } catch(err: any){
        throw err;
    }
}


export async function productList(
    idProduct?: string | number,
    pagination: PaginationType = {page: 1, size: 10},
) {
    try {
        const endPoint = defaultEndPoint + "/product/list";
        
        const response = await api.get(endPoint, {
            params: {
                idProduct: idProduct,
                ...pagination
            }
        }) as responseAxiosInterfaces<ResultsWithPagination<ProdutoInterface[]>>;
            
        return response.data.data!;
    }catch(err:any){
        throw err
    }
}




export async function productUpdate(updtData: ProdutoSimpleFormShema): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/product/update";

        // console.log(JSON.stringify(updtData, null, "  "));

        // console.log(JSON.stringify(prodData, null, "  "));

        const result = await api.post(endPoint, 
            [
                {
                    id_produto: Number(updtData.id_produto!),
                    nome_prod: updtData.nome,
                    preco: Number(updtData.preco),
                    quantidade: Number(updtData.quantidade)
                }
            ]
        ) as responseAxiosInterfaces<null>;

        console.log(JSON.stringify(result.data.data, null, "  "));

        return true;
    }catch(error){
        throw error
    }
}


export async function productAdd(prodList: ProdutosAddFormType): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/product/add";
        
        const payload = prodList.produtos.map(item => ({
            nome_prod: item.nome,
            preco: Number(item.preco),
            quantidade: Number(item.quantidade),
        }));

        // console.log(JSON.stringify(payload, null, "  "));
        // console.log(JSON.stringify(updtData, null, "  "));
        // console.log(JSON.stringify(prodData, null, "  "));

        const result = await api.post(endPoint, payload) as responseAxiosInterfaces<null>;

        console.log(JSON.stringify(result.data.data, null, "  "));

        return true;
    }catch(error){
        throw error
    }
}


export async function productDeleteSingle(idProd: number): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/product/delete";

        // console.log(JSON.stringify(updtData, null, "  "));

        // console.log(JSON.stringify(prodData, null, "  "));

        const result = await api.post(endPoint, 
            [
                idProd
            ]
        ) as responseAxiosInterfaces<null>;

        console.log(JSON.stringify(result.data.data, null, "  "));

        return true;
    }catch(error){
        throw error
    }
}


// Aceita parceria
export async function acceptPartner(idCliente: string | number): Promise<boolean>{
    try {
        const endPoint = `${defaultEndPoint}/partner/accept`;
        
        const data = {
            idPartner: Number(idCliente),
        }
        console.log(data);

        const response = await api.put(endPoint, data);
        // console.log("RESPONPSE: ", JSON.stringify(response.data, null, "  "));

        return true;
    }catch(err: any){
        throw err;
    }
}

// Enviar solicitação de parceria
export async function requestPartner(idCliente: string | number):Promise<boolean> {
    try {
        const endPoint = `${defaultEndPoint}/partner`;
        
        const data = {
            ids: [Number(idCliente)],
        };
        console.log(data);

        const response = await api.put(endPoint, data);

        // console.log(response);

        return true;
    }catch(err: any){
        throw err;
    }
}

export async function rejectPartner(idCliente: string | number) {
    try {
        const endPoint = `${defaultEndPoint}/partner/reject`;
        
        const data = {
            idPartner: Number(idCliente),
        };
        // console.log("reject: ", data);

        const response = await api.put(endPoint, data);

        // console.log(response);

        return true;
    }catch(err: any){
        throw err;
    }
} 



export async function updateBuy(updtData: DataUpdateBuyType): Promise<boolean> {
    try {
        const endPoint = defaultEndPoint + "/product/purchace/update";

        const res = await api.post(endPoint, [updtData]) as responseAxiosInterfaces<null>;

        // console.log(JSON.stringify(res, null, "  "));

        return true;    
    }catch(error){
        throw error
    }
}

