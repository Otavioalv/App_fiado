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

export type PaymentStatusType = "PAID" | "PENDING" | "LOADING";
export type ShoppingStatusType = "CANCELED"| "REFUSED" | "ANALYSIS"| "WAIT_REMOVE" | "REMOVED" | "LOADING";

export type AllShoppingStatusType = ShoppingStatusType | PaymentStatusType
export interface ShoppingData {
   id_compra: number,
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
   nomeestabelecimento: string,
   
   shopping_status: ShoppingStatusType,
   payment_status: PaymentStatusType,
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
export type ActionRelationShipStatusType = Exclude<RelationshipStatusType, "ALL" | "RECEIVED">; // Adicionar NONE

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
export type TypeShoppingList = "canceled" | "refused" | "analysis" | "wait_remove" | "paid" | "pending" | "all" | "removed";
export type TypeMessageList = "read" | "unread" | "all";

export type NotificationType = "new_partner" | "accepted_partner" | "purchase_request" | "purchase_accepted" | "purchase_rejected" | "purchase_updated";

export interface NotificationInterface {
   id_mensagem: number,
	mensagem: string,
	created_at: string,
	from_user_id: number,
	type: NotificationType,
   title_notification: "Nova solicitação de compra",
   read_at?: string,
}

export interface CartInfoInterface {
   cart_id: number,
   id_product: number,
   id_fornecedor: number,
   quantidade: number,
   prazo: string,
   created_at: string,
   nome_prod: string,
   preco: string,
   nome_fornecedor: string,
   nome_estabelecimento: string,
}

export type CartLocalItem = Omit<CartInfoInterface, 'cart_id' | 'created_at' | 'prazo'> & {
  cart_id?: number
  created_at?: string,
  prazo?: string,
}

export interface AddShoppingCartParams {
   id_compra: number | string,
   id_fornecedor: number | string,
   quantidade: number,
   prazo: string
}
