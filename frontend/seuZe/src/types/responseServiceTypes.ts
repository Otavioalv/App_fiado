interface DefaultUserDataType {
    nome: string, 
    telefone: string,
    apelido?: string
}

export type PaginationType = {
   page: number,
	size: number,
	
   search?: string,
	filter?: string,
	
   filterList?: string|number[],
	total?: string,
	totalPages?: string,
}

export type ShoppingData =  {
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



export type AddressDataType = {
   nomeestabelecimento: string,
   numeroimovel: string,
   logradouro: string,
   bairro: string,
   complemento: string,
   cep: string,
   uf: string,
}

export type PartnerStatusType = {
   cliente_check: boolean,
   fornecedor_check: boolean,
   created_at: string,
}

export type PaginationResponseType = {
   pagination?: PaginationType
}

export type ClienteDataType = DefaultUserDataType & {id_cliente: number}
export type FornecedorDataType = DefaultUserDataType & AddressDataType & {id_fornecedor: number};


export type PartnerClienteType = ClienteDataType & PartnerStatusType;
export type PartnerFornecedorType = FornecedorDataType & PartnerStatusType;

export type ResultsWithPagination<T> = {
   list: T,
   pagination?: PaginationType
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