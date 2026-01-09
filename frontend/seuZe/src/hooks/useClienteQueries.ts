import { listAllFornecedores } from "../services/clienteService";
import { FilterType } from "../types/responseServiceTypes";
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
