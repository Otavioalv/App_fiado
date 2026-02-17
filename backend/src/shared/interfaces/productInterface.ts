import { RelationshipStatusType } from "./userInterfaces";

export interface productInterface {
    id_produto?: number;
    fk_id_fornecedor?:number;
    disponivel?: boolean;
    nome_prod: string;
    preco: number;
    quantidade: number;
}

export type PaymentStatusType = "PAID" | "PENDING";
export type ShoppingStatusType = "CANCELED"| "REFUSED" | "ANALYSIS"| "WAIT_REMOVE" | "REMOVED" | "ALL" ;
export type AllShoppingStatusType = ShoppingStatusType | PaymentStatusType;

export type MessageListType = "read" | "unread" | "all";

export interface compraInterface {
    id_compra: number;
    id_fornecedor: number;
    quantidade: number; 
    
    prazo: Date; 
    created_at?: Date;
    coletado_em?: Date; 

    nome_produto?: string;
    nomeestabelecimento?:string;
    
    valor_unit?: number;
    id_cliente?: number;
    
    quitado?: boolean;
    retirado?: boolean;
    aceito?: boolean;
    
    cancelado?:boolean;
    
    shopping_status?: ShoppingStatusType;
    payment_status?: PaymentStatusType;
}


export interface ProdFornecedorInterface {
    id_fornecedor: number,
    nome_fornecedor: string,
    nomeestabelecimento: string,
    cliente_check: boolean,
    fornecedor_check: boolean,
    relationship_status: RelationshipStatusType,
    apelido?: string,
}

export type ListProductWithFornecedor = productInterface & ProdFornecedorInterface;
