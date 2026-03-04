import { PaginationType, TypeShoppingList } from "@/src/types/responseServiceTypes";

export interface ShoppingListParams {
    pagination: PaginationType, 
    listType: TypeShoppingList,
    idToUser?: string | number,
    idCompra?: string | number,
}

