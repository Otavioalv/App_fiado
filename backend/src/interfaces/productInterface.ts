export interface productInterface {
    id_produto?: number;
    fk_id_fornecedor?:number;
    disponivel?: boolean;
    nome: string;
    preco: number;
    quantidade: number;
}