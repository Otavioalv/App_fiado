import { QueryFunctionContext, QueryKey, useInfiniteQuery, UseInfiniteQueryOptions } from "@tanstack/react-query";
import { PaginationResponseType } from "../types/responseServiceTypes";


interface UseInfiniteProps<T extends PaginationResponseType> extends 
Omit<UseInfiniteQueryOptions, "queryKey" | "queryFn" | "initialPageParam" | "getNextPageParam">
{
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


