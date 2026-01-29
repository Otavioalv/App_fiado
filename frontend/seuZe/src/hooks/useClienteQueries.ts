import { useMutation, useQuery } from "@tanstack/react-query";
import { listPartner, login, me, productList, register, shoppingList, update } from "../services/clienteService";
import { FilterType, TypeShoppingList, TypeUserList} from "../types/responseServiceTypes";
import { useInfiniteList } from "./useInfiniteList";
import { BasicFormSchema, DefaultRegisterSchema, LoginSchema } from "../schemas/FormSchemas";

// export function useListAllFornecedores(filters: FilterType) {
//     return useInfiniteList({
//         queryKey: ['list-all-fornecedores', filters],
//         queryFn: async ({pageParam}) => {

//             return await listAllFornecedores({
//                 page: pageParam as number, 
//                 size: 20,
//                 filter: filters.filter,
//                 search: filters.search
//             });
//         },
//         initialPageParam: 1
//     });
// }

export function useListPartner(filters: FilterType, listType: TypeUserList, size: number = 20) {
    const key: string = `list-partner-fornecedor`;
    // console.log(JSON.stringify(filters, null, "  "), listType, key);

    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async ({pageParam}) => {
            return await listPartner(
                {
                    page: pageParam as number, 
                    size: size,
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
    const key: string = `product-list`;

    return useInfiniteList({
        queryKey: [key, listType, filters],
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
