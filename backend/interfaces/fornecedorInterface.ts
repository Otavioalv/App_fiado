import { userInterface } from "./userInterface";

export interface fornecedorInterface extends userInterface{
    id_fornecedor?: number;
    nomeEstabelecimento:string;
}

