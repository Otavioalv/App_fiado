import { addressInterface } from "./addressInterface";

export interface fornecedorInterface extends addressInterface{
    id_fornecedor?: number;
    nome: string;
    senha: string;
    apelido: string;
    telefone: string;
    nomeEstabelecimento: string;
}