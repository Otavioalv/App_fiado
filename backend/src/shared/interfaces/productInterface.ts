import { RelationshipStatusType } from "./userInterfaces";

export interface productInterface {
    id_produto?: number;
    fk_id_fornecedor?:number;
    disponivel?: boolean;
    nome_prod: string;
    preco: number;
    quantidade: number;
}

export type shoppingStatusType = "CANCELED"| "REFUSED"| "ANALYSIS"| "WAIT_REMOVE"| "PAID"| "PENDING";

export interface compraInterface {
    id_compra: number;
    id_fornecedor: number;
    quantidade: number; 

    
    prazo: Date; 
    created_at?: Date;
    coletado_em?: Date; 

    nome_produto?: string;
    
    valor_unit?: number;
    id_cliente?: number;
    
    quitado?: boolean;
    retirado?: boolean;
    aceito?: boolean;
    
    cancelado?:boolean;
    
    shopping_status?: shoppingStatusType,
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