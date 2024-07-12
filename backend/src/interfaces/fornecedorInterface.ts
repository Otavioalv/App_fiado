import { addressInterface } from "./addressInterface";
import { userInterface } from "./userInterface";

export interface fornecedorInterface extends userInterface, addressInterface{
    id_fornecedor?: number;
    nomeEstabelecimento:string;
}

