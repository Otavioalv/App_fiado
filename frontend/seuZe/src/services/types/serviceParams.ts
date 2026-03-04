import { PaginationType, TypeUserList } from "@/src/types/responseServiceTypes";


export interface ListPartnerParams {
    listType: TypeUserList,
    pagination: PaginationType,
    id?: string | number,   
}