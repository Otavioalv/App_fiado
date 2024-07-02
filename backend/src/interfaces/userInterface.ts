import { addressInterface } from "./addressInterface";


export interface userInterface extends addressInterface{
    nome: string;
    senha: string;
    apelido?: string;
    telefone: string;
}