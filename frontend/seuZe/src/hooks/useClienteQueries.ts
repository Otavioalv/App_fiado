import { useMutation, useQuery } from "@tanstack/react-query";
import { listPartner, login, me, productList, register, shoppingList, update } from "../services/clienteService";
import { FilterType, PartnerFornecedorType, ProductAndFornecedorData, ResultsWithPagination, TypeShoppingList, TypeUserList} from "../types/responseServiceTypes";
import { useInfiniteList } from "./useInfiniteList";
import { BasicFormSchema, DefaultRegisterSchema, LoginSchema } from "../schemas/FormSchemas";

export function useListPartner(filters: FilterType, listType: TypeUserList, size: number = 20) {
    const key: string = `list-partner-fornecedor`;
    // console.log(JSON.stringify(filters, null, "  "), listType, key);

    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async ({pageParam}) => {
            return await listPartner(
                listType,
                undefined,
                {
                    page: pageParam as number, 
                    size: size,
                    filter: filters.filter,
                    search: filters.search
                }, 
            );
        },
        initialPageParam: 1,
    });
}

export function useListPartnerFromId(id: string | number) {
    const key: string = `list-partner-fornecedor`;

    return useQuery({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async (): Promise<PartnerFornecedorType> => {
            const result = await listPartner(
                "all",
                id,
                {
                    page: 1, 
                    size: 1,
                    filter: "Nome",
                    search: ""
                }, 
            );

            return result.list[0];
        },
    });
}



export function useProductList(filters: FilterType, listType: TypeUserList) {
    const key: string = `product-list`;

    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async({pageParam}) => {
            return await productList(
                listType,
                undefined,
                {
                    page: pageParam as number,
                    size: 20,
                    filter: filters.filter,
                    search: filters.search
                },
            )
        }, 
        initialPageParam: 1
    });

}

export function useProductListFromId(id: string | number, filters: FilterType) {
    const key: string = `product-list`;
    
    return useInfiniteList<ResultsWithPagination<ProductAndFornecedorData[]>>({
        queryKey: [key, id, filters],
        enabled: !!id,
        queryFn: async ({pageParam}) => {
            return await productList(
                "all",
                id,
                {
                    page: pageParam as number, 
                    size: 20,
                    filter: "Nome do Produto",
                    search: filters.search,
                }, 
            );
        },
        initialPageParam: 1,
    });
}



export function useShoppingList(filters: FilterType, listType: TypeShoppingList, size: number = 20) {
    const key: string = `shopping-list`;
    
    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async({pageParam}) => {
            return await shoppingList(
                {
                    page: pageParam as number,
                    size: size,
                    filter: filters.filter,
                    search: filters.search
                },
                listType
            )
        }, 
        initialPageParam: 1
    });
}

export function useMe() {
    const key: string = "me-cliente";

    return useQuery({
        queryKey: [key],
        queryFn: async () => {
            return await me();
        },
        // staleTime: 1000 * 60 * 10, // 10min
        // retry: 1,
    });
}

export function useRegister() {
    
    // retorna boleano, erro tipo any, entrada tipo DefaultRegisterSchema
    return useMutation<boolean, any, DefaultRegisterSchema>({
        mutationFn: async (data) => {
            return await register(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
        }
    });
}



export function useLogin() {
    // Testar erro tipo any
    return useMutation<string | null, any, LoginSchema>({
        mutationFn: async (data) => {
            return await login(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
        }
    });
}


export function useUpdate() {
    return useMutation<boolean, any, BasicFormSchema>({
        mutationFn: async (data) => {
            return await update(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
        }
    })
}
