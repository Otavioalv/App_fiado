import { addressInterface } from "./addressInterface";
import { userInterface } from "./userInterface";

// alterar o tipo do numero do estabelecimento
export interface fornecedorInterface extends userInterface, addressInterface{
    id_fornecedor?: number;
    nomeEstabelecimento:string;
}

// separar depois
export type queryFilterFornecedor = {
    pagination: number;
    size: number;
    total: number;
    totalPages: number;
    search: string;
};


