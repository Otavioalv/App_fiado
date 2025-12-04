export interface productInterface {
    id_produto?: number;
    fk_id_fornecedor?:number;
    disponivel?: boolean;
    nome: string;
    preco: number;
    quantidade: number;
}




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
}
