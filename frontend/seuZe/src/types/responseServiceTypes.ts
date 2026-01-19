interface DefaultUserDataType {
    nome: string, 
    telefone: string,
    apelido?: string
}

export interface FilterType {
   search?: string,
   filter?: string
}

export type PaginationType = FilterType & {
   page: number,
	size: number,
	
   // filterList?: string|number[],
   filterList?: string[],
	total?: number,
	totalPages?: number,
}

export interface ShoppingData {
   id_compra?: number,
   fk_fornecedor_id: number,
   quantidade: number,

   prazo: string, // Date
   created_at: string, // Date
   coletado_em: string, // Date
   
   nome_produto: string,

   valor_unit: string, // number
   fk_cliente_id: number,

   quitado: boolean,
   retirado: boolean,
   aceito: boolean,
   
   cancelado: boolean,

   nome_user: string,
   apelido_user: string,
   telefone_user: string,
}


export interface ProductAndFornecedorData{
   id_produto: number,
   nome_prod: string,
   preco: string, // number
   quantidade: number,
   id_fornecedor: number,
   nome_fornecedor: string,
   nomeestabelecimento: string,
   cliente_check: boolean,
   fornecedor_check: boolean,
   relationship_status: RelationshipStatusType,
   apelido?:string,
}




export type AddressDataType = {
   nomeestabelecimento: string,
   numeroimovel: string,
   logradouro: string,
   bairro: string,
   complemento: string,
   cep: string,
   uf: string,
}

export type RelationshipStatusType = "ACCEPTED" | "SENT" | "RECEIVED" | "NONE";

export interface PartnerStatusType {
   cliente_check: boolean,
   fornecedor_check: boolean,
   created_at?: string,
   relationship_status?: RelationshipStatusType,
}

export type PaginationResponseType = {
   pagination: PaginationType
}

export type ClienteDataType = DefaultUserDataType & {id_cliente: number}
export type FornecedorDataType = DefaultUserDataType & AddressDataType & {id_fornecedor: number};

export type PartnerClienteType = ClienteDataType & PartnerStatusType;
export type PartnerFornecedorType = FornecedorDataType & PartnerStatusType;

export interface ResultsWithPagination<T> {
   list: T,
   pagination: PaginationType
}

export type ErrorTypes = 
   "NETWORK" | 
   "UNAUTHORIZED" | 
   "SERVER" | 
   "UNKNOWN" | 
   "INTERNAL" | 
   "CLIENT" | 
   "FORBIDDEN" |
   "NOTFOUND" |
   "BADREQUEST";

export type AppDefaultSizes = "S" | "M" | "L";

export type OnSubmitSearchType = (search: string, filter?: string) => void;

export type TypeUserList = "all" | "received" | "sent" | "accepted" | "none";