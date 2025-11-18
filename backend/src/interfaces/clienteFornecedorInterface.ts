export interface clienteFornecedorInterface {
    id_cliente_fornecedor: number;
    // associado?: boolean,
    fk_cliente_id: number;
    fk_fornecedor_id: number;
    cliente_check: boolean;
    fornecedor_check: boolean;
}

export type queryFilter = {
    page: number;
    size: number;
    total: number;
    filter: string;
    totalPages?: number;
    search?: string;
    filterList?: string[]
};