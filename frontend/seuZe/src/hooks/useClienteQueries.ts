import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptPartner, listMessages, listPartner, login, me, productList, register, rejectPartner, requestPartner, shoppingList, update } from "../services/clienteService";
import { ActionRelationShipStatusType, FilterType, NotificationInterface, PartnerFornecedorType, ProductAndFornecedorData, RelationshipStatusType, ResultsWithPagination, ShoppingData, TypeShoppingList, TypeUserList} from "../types/responseServiceTypes";
import { useInfiniteList } from "./useInfiniteList";
import { BasicFormSchema, DefaultRegisterSchema, LoginSchema } from "../schemas/FormSchemas";
import { OnPressActionParamsType } from "../components/ui/RelationshipActions";

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

            return result.list[0] || [];
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
                undefined,
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

export function useListMessages(filters: FilterType, size: number = 20) {
    const key: string = 'list-messages';

    return useInfiniteList<ResultsWithPagination<NotificationInterface[]>>({
        queryKey: [key, filters],
        queryFn: async ({pageParam}) => {
            return await listMessages({
                page: pageParam as number, 
                size: size,
                filter: filters.filter,
                search: filters.search
            });
        },
        initialPageParam: 1,
    }); 
}



export function useProductSingleFromId(id:string | number) {
    const key: string = `product-single`;
    
    return useQuery<ProductAndFornecedorData>({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async () => {
            const result = await productList(
                "all",
                undefined,
                id,
                {
                    page: 1, 
                    size: 1,
                    filter: "Nome do Produto",
                    search: "",
                }, 
            );

            return result.list[0] || [];
        },
    });
}


export function useShoppingList(filters: FilterType, listType: TypeShoppingList, size: number = 20) {
    const key: string = `shopping-list`;
    
    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async({pageParam}) => {
            return await shoppingList({
                pagination: {
                    page: pageParam as number,
                    size: size,
                    filter: filters.filter,
                    search: filters.search
                },
                listType: listType,
            })
        }, 
        initialPageParam: 1
    });
}

export function useShoppingListFromid(id:string | number) {
    const key: string = `shopping-list`;

    return useQuery<ShoppingData>({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async() => {
            const result = await shoppingList({
                listType: "all",
                pagination: {
                    page: 1,
                    size: 1,
                },
                idCompra: id,
            });
            return result.list[0] || [];
        }
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


export function useUpdatePartnerClienteStatus(filters: FilterType, listType: TypeUserList) {
    type ListDataType = InfiniteData<ResultsWithPagination<PartnerFornecedorType[]>>;
    type PartnerMutationContext = {
        previousData: ListDataType | undefined;
    };

    const key: string = `list-partner-fornecedor`;
    
    const queryClient = useQueryClient();
    const queryKey = [key, listType, filters]


    return useMutation<any, any, OnPressActionParamsType, PartnerMutationContext>({
        mutationFn: async ({id, newStatus}) => {

            const actions:Record<
                ActionRelationShipStatusType, 
                (id: string | number) => Promise<boolean>
            > = {
                ACCEPTED: acceptPartner,
                SENT: requestPartner,
                NONE: rejectPartner,
            };


            console.log("teste: ", id, newStatus);
            
            // Chamar api
            return await actions[newStatus](id);
        },
        onMutate: async ({id, newStatus}) => {
            // Cancela fetchs
            await queryClient.cancelQueries({queryKey});

            // Salva estado anterior
            const previousData = queryClient.getQueryData<ListDataType>(queryKey);
            // console.log(JSON.stringify(previousData, null, "  "));
            // console.log(previousData);

            // Atualiza de forma otimista
            queryClient.setQueryData<ListDataType>(queryKey, (old) => {
                if(!old) return old;
                
                return {
                    ...old, 
                    pages: old.pages.map((page) => ({
                        ...page, 
                        list: page.list.map((partner) => 
                            String(partner.id_fornecedor) === String(id)
                                ? {...partner, relationship_status: newStatus}
                                : partner
                        )
                    })),
                };
            });
            return {previousData}
        },
        onError: (err, variables, context) => {
            console.log(context?.previousData);
            // retorna aos dados anteirores se der erro
            if(context?.previousData)
                queryClient.setQueryData(queryKey, context.previousData);
        },
        onSettled: () => {
            // Sincroniza, faz refatch
            queryClient.invalidateQueries({queryKey: ['list-partner-fornecedor']});
            queryClient.invalidateQueries({queryKey: ['product-list'],});
        }
    });
}

export function useUpdatePartnerProductStatus(filters: FilterType, listType: TypeUserList) {
    type ListDataType = InfiniteData<ResultsWithPagination<ProductAndFornecedorData[]>>;
    type PartnerMutationContext = {
        previousData: ListDataType | undefined;
    };

    const key: string = `product-list`;
    
    const queryClient = useQueryClient();
    const queryKey = [key, listType, filters]


    return useMutation<any, any, OnPressActionParamsType, PartnerMutationContext>({
        mutationFn: async ({id, newStatus}) => {

            const actions:Record<
                ActionRelationShipStatusType, 
                (id: string | number) => Promise<boolean>
            > = {
                ACCEPTED: acceptPartner,
                SENT: requestPartner,
                NONE: rejectPartner,
            };

            // Chamar api
            return await actions[newStatus](id);
        },
        onMutate: async ({id, newStatus}) => {
            // Cancela fetchs
            await queryClient.cancelQueries({queryKey});

            // Salva estado anterior
            const previousData = queryClient.getQueryData<ListDataType>(queryKey);
            // console.log(JSON.stringify(previousData, null, "  "));
            // console.log(previousData);

            // Atualiza de forma otimista
            queryClient.setQueryData<ListDataType>(queryKey, (old) => {
                if(!old) return old;
                
                return {
                    ...old, 
                    pages: old.pages.map((page) => ({
                        ...page, 
                        list: page.list.map((partner) => 
                            String(partner.id_fornecedor) === String(id)
                                ? {...partner, relationship_status: newStatus}
                                : partner
                        )
                    })),
                };
            });
            return {previousData}
        },
        onError: (err, variables, context) => {
            console.log(context?.previousData);
            // retorna aos dados anteirores se der erro
            if(context?.previousData)
                queryClient.setQueryData(queryKey, context.previousData);
        },
        onSettled: () => {
            // Sincroniza, faz refatch
            queryClient.invalidateQueries({queryKey: ['list-partner-fornecedor']});
            queryClient.invalidateQueries({queryKey: ['product-list'],});
        }
    });
}

export function useUpdatePartnerInfoFornecedor(id: string | number) {
    type PartnerMutationContext = {
        previousData: PartnerFornecedorType | undefined;
    };
    
    const key: string = `list-partner-fornecedor`;

    const queryClient = useQueryClient();
    const queryKey = [key, id]


    return useMutation<any, any, OnPressActionParamsType, PartnerMutationContext>({
        mutationFn: async ({id, newStatus}) => {
            // console.log("MUTATION: ", id, newStatus);
            
            const actions:Record<
                ActionRelationShipStatusType, 
                (id: string | number) => Promise<boolean>
            > = {
                ACCEPTED: acceptPartner,
                SENT: requestPartner,
                NONE: rejectPartner,
            };

            // Chamar api
            return await actions[newStatus](id);
        },
        onMutate: async ({id, newStatus}) => {
            // Cancela fetchs
            await queryClient.cancelQueries({queryKey});

            // Salva estado anterior
            const previousData = queryClient.getQueryData<PartnerFornecedorType>(queryKey);
            // console.log("PREVIOUS DATA: ", JSON.stringify(previousData, null, "  "));
            // console.log(previousData);

            // Atualiza de forma otimista
            queryClient.setQueryData<PartnerFornecedorType>(queryKey, (old) => {
                if(!old) return old;

                // console.log(JSON.stringify(old, null, "  "));

                return {
                    ...old,
                    relationship_status: newStatus,
                };
            });
            return {previousData}
        },
        onError: (err, variables, context) => {
            // console.log("error: ", context?.previousData, err);
            // retorna aos dados anteirores se der erro
            if(context?.previousData)
                queryClient.setQueryData(queryKey, context.previousData);
        },
        onSettled: () => {
            // Sincroniza, faz refatch
            queryClient.invalidateQueries({queryKey: ['list-partner-fornecedor']});
            queryClient.invalidateQueries({queryKey: ['product-list'],});
        }
    });   
}
