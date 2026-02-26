import { InfiniteData, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptPartner, addShoppingCard, buyProducts, deleteNotification, getTotalPriceShop, listMessages, listPartner, listShoppingCard, login, markReadAllNotifications, markReadNotification, me, productList, register, rejectPartner, requestPartner, shoppingList, update } from "../services/clienteService";
import { ActionRelationShipStatusType, AddShoppingCartParams, CartInfoInterface, CartLocalItem, FilterType, NotificationInterface, PaginationType, PartnerFornecedorType, ProductAndFornecedorData, RelationshipStatusType, ResultsWithPagination, ShoppingData, TypeMessageList, TypeShoppingList, TypeUserList} from "../types/responseServiceTypes";
import { useInfiniteList } from "./useInfiniteList";
import { BasicFormSchema, DefaultRegisterSchema, LoginSchema } from "../schemas/FormSchemas";
import { OnPressActionParamsType } from "../components/ui/RelationshipActions";
import { getDefaultPrazo, useShoppingCartStore } from "../stores/cliente/shoppingCart.store";

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

/* 
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

*/


export function useListShoppingCard(pagination: PaginationType) {
    const key: string = `shopping-cart`;

    return useInfiniteList({
        queryKey: [key, pagination],
        queryFn: async ({pageParam}) => {
            return await listShoppingCard({
                page: pageParam as number, 
                size: pagination.size,

            });
        },
        initialPageParam: 1
    });
}



export function useListMessages(filters: PaginationType, listType: TypeMessageList, size: number = 20) {
    const key: string = 'list-messages';

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


export function useListNotificationsById(id: string | number) {
    const key: string = 'list-messages';

    return useQuery({
        queryKey: [key, id],
        enabled: !!id,
        queryFn: async (): Promise<NotificationInterface>=> {
            const result = await listMessages({
                listType: "all",
                pagination: {
                    page: 1,
                    size: 1,
                },
                id: id
            });

            return result.list[0] || [];
        }
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

export function useMarkAllReadNotification() {
    const queryCliente = useQueryClient();

    return useMutation<boolean, any>({
        mutationFn: async () => {
            return await markReadAllNotifications();
        },
        onSuccess:(s) => {
            if(s) queryCliente.invalidateQueries({queryKey: ['list-messages']});
        }
    });
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
            queryClient.invalidateQueries({queryKey: ['product-list']});
        }
    });   
}

export function useDeleteNotification(filters: PaginationType, listType: TypeMessageList) {
    type ListDataType = InfiniteData<ResultsWithPagination<NotificationInterface[]>>;
    type mutationFnType = {id: number}
    type ErrorContextType = {
        previousData: ListDataType | undefined,
    }

    const key: string = 'list-messages';

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
            queryClient.invalidateQueries({queryKey: ['list-messages']});
        }
    });
}


export function useMarkNotificationById(filters: PaginationType, listType: TypeMessageList) {
    type ListDataType = InfiniteData<ResultsWithPagination<NotificationInterface[]>>;
    type mutationFnType = {id: number}
    type ErrorContextType = {
        previousData: ListDataType | undefined,
    }

    const key: string = 'list-messages';

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
            queryClient.invalidateQueries({queryKey: ['list-messages']});
        }
    });
}


export function useGetTotalShop() {
    const key: string = "total-shop";

    return useQuery({
        queryKey: [key],
        queryFn: async() => {
            return getTotalPriceShop();
            // return 129
        }
    });
}


export function useCartActions() {
    const setCart = useShoppingCartStore(s => s.setCart);
    const key = ['shopping-cart'];
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async () => {
            const currentItems = useShoppingCartStore.getState().cartItems

            const payload: AddShoppingCartParams[] = currentItems.map(item => ({
                id_compra: item.id_product,
                id_fornecedor: item.id_fornecedor,
                quantidade: item.quantidade,
                prazo: item.prazo!,
            }))

            console.log("Valores atuais: ", currentItems.length);

            await addShoppingCard(payload)
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: key })

            const previousData = queryClient.getQueryData(key)

            const currentItems = useShoppingCartStore.getState().cartItems;

            queryClient.setQueryData(key, currentItems);

            return { previousData }
        },
        onError: (_err, _vars, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(key, context.previousData);
            }
        }
    });

    function addProductToCart(product: CartLocalItem) {
        const currentItems = useShoppingCartStore.getState().cartItems

        console.log("Produto adicionado: ", product);
        
        const productWithPrazo = {
            ...product,
            prazo: product.prazo ?? getDefaultPrazo()
        }
        const existing = currentItems.find(
            item => item.id_product === product.id_product
        )

        let updatedList: CartLocalItem[]

        if(existing) {
            updatedList = currentItems.map(item =>
                item.id_product === product.id_product
                ? productWithPrazo
                : item
            )
        } else {
            updatedList = [...currentItems, productWithPrazo]
        }

        
        setCart(updatedList)

        
        mutation.mutate()
    }

    // -------- REMOVE --------
    function removeProductFromCart(productId: number) {
        const currentItems = useShoppingCartStore.getState().cartItems

        const updatedList = currentItems.filter(
            item => item.id_product !== productId
        )
        setCart(updatedList)
        mutation.mutate()
    }

    return {
        addProductToCart,
        removeProductFromCart,
        ...mutation
    }
}


export function useSaveCart() {
    const queryClient = useQueryClient();
    const setCart = useShoppingCartStore(s => s.setCart);

    return useMutation({
        mutationFn: async (items: CartInfoInterface[]) => {
            const payload: AddShoppingCartParams[] = items.map(item => ({
                id_compra: item.id_product,
                id_fornecedor: item.id_fornecedor,
                quantidade: item.quantidade,
                prazo: item.prazo!,
            }));

            await addShoppingCard(payload);

        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['shopping-cart'] });
            setCart(variables);
        }
    });
}

export function useBuyProducts(
    options?: UseMutationOptions<any, any, void, unknown>
) {
    const queryClient = useQueryClient();
    
    const clearCart = useShoppingCartStore(s => s.clearCart);
    const externalOnSuccess = options?.onSuccess;

    return useMutation({
        mutationFn: buyProducts,
        ...options,
        onSuccess: (data, variables, onMutateResult, context) => {
            queryClient.invalidateQueries({ queryKey: ['shopping-cart'] });
            clearCart();
            
            externalOnSuccess?.(data, variables, onMutateResult, context);
        },
    });
}
