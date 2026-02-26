import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { InfoProductBottomSheet } from "@/src/components/common/InfoProductBottomSheet";
import { MemoProductCard, MemoProductCardSkeleton, ProductCardProps } from "@/src/components/common/ProductCard";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { OnPressActionFunctionType } from "@/src/components/ui/RelationshipActions";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { useCartActions, useProductList, useUpdatePartnerProductStatus } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { useShoppingCartStore } from "@/src/stores/cliente/shoppingCart.store";
import { CartLocalItem, ProductAndFornecedorData, TypeUserList } from "@/src/types/responseServiceTypes";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";

const chipList: ChipDataType<TypeUserList>[] = [
    {
        id: "all",
        label: "Todos"
    },
    {
        id: "accepted",
        label: "Parcerias"
    },
    {
        id: "received",
        label: "Solicitações Recebidas"
    }, 
    {
        id: "sent",
        label: "Solicitações Enviadas"
    },
    {
        id: "none",
        label: "Conheçer Fornecedores"
    }
];

export default function Produtos() {

    const {
        searchQuery,
        filter,
        typingText,
        handleSearch,
        activeCategory,
        errorType,
        setErrorType,
        setActiveCategory,
        setTypingText,
        setFilter,
    } = useFilterScreen<TypeUserList>("all");

    const filters = useMemo(() => ({
        search: searchQuery,
        filter: filter,
    }), [searchQuery, filter]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
        isRefetching,
        isError,
        error
    } = useProductList(
        filters,
        activeCategory
    );


    // const { openSheet } = useGlobalBottomSheet();
    const { openSheet, closeSheet } = useGlobalBottomModalSheet();

    const handleOpenInfoProduct = useCallback((idProduct: number) => {
        // console.log("Tentando abrir produto:", idProduct);

        openSheet(
            <InfoProductBottomSheet 
                idProduct={idProduct}
            />, 
            ["28%"], 
            false
        );
    }, [openSheet])

    // Fecha o bottom sheet ao sair da tela.
    useFocusEffect(
        useCallback(() => {
            return () => closeSheet();
        }, [closeSheet])
    );
  

    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    const { mutate } = useUpdatePartnerProductStatus(filters, activeCategory);
    
    const handleAction: OnPressActionFunctionType = useCallback(({ id, newStatus }) => {
        mutate({ id: id, newStatus: newStatus });
    }, [mutate]);


    // const {
    //     cartItems, 
    //     addItemToCartStore,
    // } = useShoppingCartStore();
    
    // useEffect(() => {
    //     console.log("Carrinho de compras", JSON.stringify(cartItems, null, "  "));
    // }, [cartItems]);

    const {
        addProductToCart,
    } = useCartActions();


    const handleOnPressAccepted = useCallback((product: ProductAndFornecedorData) => {
        // console.log("Comprar Ação de adicionar ao carrinho: ", JSON.stringify(product, null, "  "));
        const cartData: CartLocalItem = {
            id_fornecedor: product.id_fornecedor,
            id_product: product.id_produto,
            nome_estabelecimento: product.nomeestabelecimento,
            nome_fornecedor: product.nome_fornecedor,
            nome_prod: product.nome_prod,
            preco: product.preco,
            quantidade: 1,
        };
        addProductToCart(cartData);
        // addItemToCartStore(cartData);
    }, [addProductToCart]);


    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listProds = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<ProductCardProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_produto.toString();

                const fornecedorName: string = `${u.nome_fornecedor}${u.apelido ? ` - (${u.apelido})` : ""}`;

                map.set(idString, {
                    prodName: u.nome_prod,
                    price: u.preco,
                    marketName: u.nomeestabelecimento,
                    nome: fornecedorName,
                    relationshipType: u.relationship_status,
                    id: idString,
                    idUser: u.id_fornecedor,
                    onPressActionFunction: handleAction,
                    onPressAccepted: () => handleOnPressAccepted(u),
                    onPress: () => handleOpenInfoProduct(u.id_produto)
                });
            });
        });
        return Array.from(map.values());
    }, [data, handleAction, handleOnPressAccepted, handleOpenInfoProduct]);

    const renderItem = useCallback(
        ({item}: {item: ProductCardProps}) => (
            <MemoProductCard
                {...item}

                // nome={item.nome}
                // marketName={item.marketName}
                // price={item.price}
                // prodName={item.prodName}
                // relationshipType={item.relationshipType}
                // onPress={item.onPress}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
            <View>
                <MemoProductCardSkeleton/>
            </View>
    ), []);

    useErrorScreenListener(isError, error, setErrorType);

    return (
        <ScreenErrorGuard errorType={errorType} onRetry={refetch}>
            <SearchInputList
                filterList={currentFilterList}
                onSubmit={handleSearch}
                inputValue={typingText}
                setInputValue={setTypingText}
                filterValue={filter.length ? filter : currentFilter}
                setFilterValue={setFilter}
                placeholder="Nome, Apelido, Estabelecimento..."
            />

            <GenericInfiniteList
                SkeletonComponent={<MemoProductCardSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                    HeaderComponent: <ChipListSkeleton/>
                }}
                data={listProds}
                renderItem={renderItem}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                // isLoading={true}
                isRefetching={isRefetching}
                keyExtractor={(i) => i.id.toString()}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onRefresh={refetch}
                HeaderComponent={
                    <ChipList 
                        chipList={chipList}
                        itemSelected={activeCategory} 
                        setItemSelected={setActiveCategory}
                    />
                }
                emptyMessage={"Nenhum produto encontrado"}
            />
        </ScreenErrorGuard>
    ); 
}
