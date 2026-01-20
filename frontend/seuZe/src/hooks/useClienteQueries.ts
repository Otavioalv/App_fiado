import { listAllFornecedores, listPartner, productList, shoppingList } from "../services/clienteService";
import { FilterType, TypeUserList} from "../types/responseServiceTypes";
import { useInfiniteList } from "./useInfiniteList";

export function useListAllFornecedores(filters: FilterType) {
    return useInfiniteList({
        queryKey: ['list-all-fornecedores', filters],
        queryFn: async ({pageParam}) => {

            return await listAllFornecedores({
                page: pageParam as number, 
                size: 20,
                filter: filters.filter,
                search: filters.search
            });
        },
        initialPageParam: 1
    });
}

export function useListPartner(filters: FilterType, listType: TypeUserList) {
    const key: string = `list-partner-fornecedor-${listType}`;
    // console.log(JSON.stringify(filters, null, "  "), listType, key);

    return useInfiniteList({
        queryKey: [key, filters],
        queryFn: async ({pageParam}) => {
            return await listPartner(
                {
                    page: pageParam as number, 
                    size: 20,
                    filter: filters.filter,
                    search: filters.search
                }, 
                listType
            );
        },
        initialPageParam: 1,
    });
}



export function useProductList(filters: FilterType, listType: TypeUserList) {
    const key: string = `product-list-${listType}`;

    return useInfiniteList({
        queryKey: [key, filters],
        queryFn: async({pageParam}) => {
            return await productList(
                {
                    page: pageParam as number,
                    size: 20,
                    filter: filters.filter,
                    search: filters.search
                },
                listType
            )
        }, 
        initialPageParam: 1
    });

}

export function useShoppingList(filters: FilterType/* , listType: TypeUserList */) {
    const key: string = `shopping-list`;

    return useInfiniteList({
        queryKey: [key, filters],
        queryFn: async({pageParam}) => {
            return await shoppingList(
                {
                    page: pageParam as number,
                    size: 20,
                    filter: filters.filter,
                    search: filters.search
                },
                // listType
            )
        }, 
        initialPageParam: 1
    });
}



// import { useInfiniteList } from './useInfiniteList';
// import { 
//   listAssociados, 
//   listNaoAssociados, 
//   listAllClientes 
// } from '@/src/services/clienteService';

// // Hook 1: Todos
// export function useClientes() {
//   return useInfiniteList({
//     queryKey: ['clientes', 'all'], // Query keys organizadas
//     queryFn: ({ pageParam }) => listAllClientes({ page: pageParam, size: 20 }),
//   });
// }

// // Hook 2: Associados
// export function useAssociados() {
//   return useInfiniteList({
//     queryKey: ['clientes', 'associados'],
//     queryFn: ({ pageParam }) => listAssociados({ page: pageParam, size: 20 }),
//   });
// }

// // Hook 3: Não Associados
// export function useNaoAssociados() {
//   return useInfiniteList({
//     queryKey: ['clientes', 'nao-associados'],
//     queryFn: ({ pageParam }) => listNaoAssociados({ page: pageParam, size: 20 }),
//   });
// }
