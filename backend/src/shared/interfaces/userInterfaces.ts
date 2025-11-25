export interface addressInterface {
    logradouro: string;
    bairro: string;
    uf: string;
    cep: string
    complemento?: string;
    numeroImovel?: number;
}

export interface userInterface{
    nome: string;
    senha: string;
    apelido?: string;
    telefone: string;
    cliente_check?: boolean;
    fornecedor_chec?: boolean;
    created_at: string;
}

export interface clienteInterface extends userInterface {
    id_cliente?: number;
}

export interface fornecedorInterface extends userInterface, addressInterface{
    id_fornecedor?: number;
    nomeEstabelecimento:string;
}

export interface clienteFornecedorInterface {
    id_cliente_fornecedor: number;
    fk_cliente_id: number;
    fk_fornecedor_id: number;
    cliente_check: boolean;
    fornecedor_check: boolean;
}


export interface loginInterface{
    nome: string;
    senha: string;
}

export interface idsPartnerInterface{
    ids: number[]
}