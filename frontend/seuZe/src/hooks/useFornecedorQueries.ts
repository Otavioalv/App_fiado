import { InfiniteData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptPartner, deleteNotification, listMessages, listPartner, login, markReadAllNotifications, markReadNotification, me, productAdd, productDeleteSingle, productList, productUpdate, register, rejectPartner, requestPartner, shoppingList, update, updateBuy } from "../services/fornecedorService";
import { FornecedorRegisterSchema, FornecedorUpdateSchema, LoginSchema, ProdutosAddFormType, ProdutoSimpleFormShema } from "../schemas/FormSchemas";
import { useInfiniteList } from "./useInfiniteList";
import { ActionRelationShipStatusType, DataUpdateBuyType, FilterType, NotificationInterface, PaginationType, PartnerClienteType, ProdutoInterface, ResultsWithPagination, ShoppingDataFornecedor, TypeMessageList, TypeShoppingList, TypeUserList } from "../types/responseServiceTypes";
import { OnPressActionParamsType } from "../components/ui/RelationshipActions";



export function useRegister() {
    return useMutation<boolean, any, FornecedorRegisterSchema>({
        mutationFn: async (data) => {
            return await register(data);
        },
        networkMode: "always",
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
    return useMutation<boolean, any, FornecedorUpdateSchema>({
        mutationFn: async (data) => {
            return await update(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
        }
    })
}

export function useMe(){
    const key: string = "me-fornecedor";

    return useQuery({
        queryKey: [key],
        queryFn: async () => {
            return await me();
        }
    });
}

export function useShoppingList(filters: FilterType, listType: TypeShoppingList, size: number = 20) {
    const key: string = "shopping-list-f";

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
        initialPageParam: 1,
    });
}

export function useShoppingListFromid(id:string | number) {
    const key: string = `shopping-list-f`;

    return useQuery<ShoppingDataFornecedor>({
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



export function useListPartner(filters: FilterType, listType: TypeUserList, size: number = 20) {
    const key: string = `list-partner-cliente`;
    // console.log(JSON.stringify(filters, null, "  "), listType, key);
    
    return useInfiniteList({
        queryKey: [key, listType, filters],
        queryFn: async ({pageParam}) => {
            return await listPartner({
                listType: listType,
                pagination: {
                    page: pageParam as number, 
                    size: size,
                    filter: filters.filter,
                    search: filters.search
                },
                id: undefined,
            });
        },
        initialPageParam: 1,
    });
}



export function useListPartnerFromId(id: string | number) {
    const key: string = `list-partner-cliente`;

    return useQuery({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async (): Promise<PartnerClienteType> => {
            const result = await listPartner({
                listType: "all",
                id: id,
                pagination: {
                    page: 1, 
                    size: 1,
                    filter: "Nome",
                    search: ""
                }, 
            });

            return result.list[0] || [];
        },
    });
}




export function useListMessages(filters: PaginationType, listType: TypeMessageList, size: number = 20) {
    const key: string = 'list-messages-f';

    return useInfiniteList<ResultsWithPagination<NotificationInterface[]>>({
        queryKey: [key, filters, listType],
        queryFn: async ({pageParam}) => {
            return await listMessages({
                listType: listType,
                pagination: {
                    page: pageParam as number, 
                    size: size,
                    filter: filters.filter,
                    search: filters.search
                },
            });
        },
        initialPageParam: 1,
    }); 
}

export function useMarkAllReadNotification() {
    const queryCliente = useQueryClient();

    return useMutation<boolean, any>({
        mutationFn: async () => {
            return await markReadAllNotifications();
        },
        onSuccess:(s) => {
            if(s) queryCliente.invalidateQueries({queryKey: ['list-messages-f']});
        }
    });
}


export function useDeleteNotification(filters: PaginationType, listType: TypeMessageList) {
    type ListDataType = InfiniteData<ResultsWithPagination<NotificationInterface[]>>;
    type mutationFnType = {id: number}
    type ErrorContextType = {
        previousData: ListDataType | undefined,
    }

    const key: string = 'list-messages-f';

    const queryClient = useQueryClient();
    const queryKey = [key, filters, listType];

    return useMutation<any, any, mutationFnType, ErrorContextType>({
        mutationFn: async ({id}) => {
            return await deleteNotification([id]);
        },
        onMutate: async ({id}) => {
            await queryClient.cancelQueries({queryKey});

            const previousData = queryClient.getQueryData<ListDataType>(queryKey);


            
            queryClient.setQueryData<ListDataType>(queryKey, (old) => {
                if(!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        list: page.list.filter((not) => not.id_mensagem !== id)
                    }))
                }
            });

            return {previousData}
        },
        onError:(err, variables, context) => {
            if(context?.previousData)  queryClient.setQueryData(queryKey, context.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['list-messages-f']});
        }
    });
}

export function useMarkNotificationById(filters: PaginationType, listType: TypeMessageList) {
    type ListDataType = InfiniteData<ResultsWithPagination<NotificationInterface[]>>;
    type mutationFnType = {id: number}
    type ErrorContextType = {
        previousData: ListDataType | undefined,
    }

    const key: string = 'list-messages-f';

    const queryClient = useQueryClient();
    const queryKey = [key, filters, listType];

    return useMutation<any, any, mutationFnType, ErrorContextType>({
        mutationFn: async ({id}) => {
            return await markReadNotification([id]);
        },
        onMutate: async ({id}) => {
            await queryClient.cancelQueries({queryKey});

            const previousData = queryClient.getQueryData<ListDataType>(queryKey);


            
            queryClient.setQueryData<ListDataType>(queryKey, (old) => {
                if(!old) return old;
                return {
                    ...old,
                    pages: old.pages.map((page) => ({
                        ...page,
                        list: page.list.filter((not) => not.id_mensagem !== id)
                    }))
                }
            });

            return {previousData};
        },
        onError:(err, variables, context) => {
            if(context?.previousData)  queryClient.setQueryData(queryKey, context.previousData);
        },
        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ['list-messages-f']});
        }
    });
}



export function useProductList(filters: FilterType) {
    const key: string = `product-list-f`;

    return useInfiniteList({
        queryKey: [key, filters],
        queryFn: async({pageParam}) => {
            return await productList(
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

export function useProductSingleFromId(id:string | number) {
    const key: string = `product-single-f`;
    
    console.log(id, "ID DIFERENE....");
    return useQuery<ProdutoInterface>({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async () => {
            const result = await productList(
                id,
                {
                    page: 1, 
                    size: 1,
                    filter: "Nome do Produto A-Z",
                    search: "",
                }, 
            );
            // console.log(JSON.stringify(result.list[0], null, "  "));
            return result.list[0] || [];
        },
    });
}

export function useProductUpdate() {
    const queryCliente = useQueryClient();

    return useMutation<boolean, any, ProdutoSimpleFormShema>({
        mutationFn: async (data) => {
            return productUpdate(data);
        },
        onSuccess: (s) => {
            if(s) queryCliente.invalidateQueries({queryKey: ['product-list-f']});
        }
    })
}


export function useProductAdd() {
    const queryCliente = useQueryClient();

    return useMutation<boolean, any, ProdutosAddFormType>({
        mutationFn: async (data) => {
            return productAdd(data);
        },
        onSuccess: (s) => {
            if(s) queryCliente.invalidateQueries({queryKey: ['product-list-f']});
        }
    })
}

export function useProductDeleteSingle() {
    const queryCliente = useQueryClient();

    return useMutation<boolean, any, number>({
        mutationFn: async (data) => {
            return productDeleteSingle(data);
        },
        onSuccess: (s) => {
            if(s) queryCliente.invalidateQueries({queryKey: ['product-list-f']});
        }
    })
}




export function useUpdateBuy() {
    const queryClient = useQueryClient();

    return useMutation<boolean, any, DataUpdateBuyType>({
        mutationFn: async (data) => {
            return await updateBuy(data);
        },
        networkMode: 'always',
        onSuccess: (s) => {
            console.log(s);
            queryClient.invalidateQueries({queryKey: ['shopping-list-f']});
        }
    })
}


export function useUpdatePartnerFornecedorStatus(filters: FilterType, listType: TypeUserList) {
    type ListDataType = InfiniteData<ResultsWithPagination<PartnerClienteType[]>>;
    type PartnerMutationContext = {
        previousData: ListDataType | undefined;
    };

    const key: string = `list-partner-cliente`;
    
    const queryClient = useQueryClient();
    const queryKey = [key, listType, filters];

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
                            String(partner.id_cliente) === String(id)
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
            queryClient.invalidateQueries({queryKey: ['list-partner-cliente']});
            // queryClient.invalidateQueries({queryKey: ['product-list-f'],});
        }
    });
}

export function useUpdatePartnerInfoCliente(id: string | number) {
    type PartnerMutationContext = {
        previousData: PartnerClienteType | undefined;
    };
    
    const key: string = `list-partner-cliente`;

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
            const previousData = queryClient.getQueryData<PartnerClienteType>(queryKey);
            // console.log("PREVIOUS DATA: ", JSON.stringify(previousData, null, "  "));
            // console.log(previousData);

            // Atualiza de forma otimista
            queryClient.setQueryData<PartnerClienteType>(queryKey, (old) => {
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
            queryClient.invalidateQueries({queryKey: ['list-partner-cliente']});
        }
    });   
}
