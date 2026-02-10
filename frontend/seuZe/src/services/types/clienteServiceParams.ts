import { PaginationType, TypeShoppingList } from "@/src/types/responseServiceTypes";

export interface ShoppingListParams {
    pagination: PaginationType, 
    listType: TypeShoppingList,
    idFornecedor?: string | number,
    idCompra?: string | number,
}