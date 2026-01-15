import { QueryFunctionContext, QueryKey, useInfiniteQuery } from "@tanstack/react-query";
import { PaginationResponseType } from "../types/responseServiceTypes";


interface UseInfiniteProps<T extends PaginationResponseType>{
    queryKey: QueryKey,
    queryFn: (context: QueryFunctionContext) => Promise<T>,
    initialPageParam: number
}

export function useInfiniteList<T extends PaginationResponseType>({
    queryKey, 
    queryFn,
    initialPageParam = 1
}: UseInfiniteProps<T>) {

    return useInfiniteQuery({
        queryKey, 
        queryFn,
        initialPageParam,
        // retry: false,
        // networkMode: "always",
        getNextPageParam: (lastPage) => {
            const { page, totalPages } = lastPage.pagination;
            return page < totalPages! ? page + 1 : undefined;
        }
    });
}
