import { useCartActions, useProductListFromId } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { MemoProductCardSimple, MemoProductCardSimpleSkeleton, ProductCardSimpleProps } from "../../common/ProductCardSimple";
import { GenericInfiniteList, GenericInfiniteListType } from "../../common/GenericInfiniteList";
import { ScreenErrorGuard } from "../../common/ScreenErrorGuard";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { SearchInputList } from "../../common/SearchInputList";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { InfoProductBottomSheet } from "../../common/InfoProductBottomSheet";
import { useShoppingCartStore } from "@/src/stores/cliente/shoppingCart.store";
import { CartLocalItem, ProductAndFornecedorData } from "@/src/types/responseServiceTypes";


export function ListProdsTab() {
    const { id } = useLocalSearchParams<{ id: string }>();    

    // const [errorType, setErrorType] = useState<ErrorTypes | null>(null);

    const {
        searchQuery,
        typingText,
        errorType,
        setErrorType,
        handleSearch,
        setTypingText,
    } = useFilterScreen(null);

    const {
        data: dataProduct,
        isLoading: isLoadingProduct,
        isRefetching: isRefetchingProduct,
        error: errorProduct,
        isError: isErrorProduct,
        refetch: refetchProduct,
        hasNextPage: hasNextPageProduct,
        isFetchingNextPage: isFetchingNextPageProduct,
        fetchNextPage: fetchNextPageProduct
    } = useProductListFromId(
        id,
        {
            search: searchQuery,
        }
    );

    const { openSheet, closeSheet } = useGlobalBottomModalSheet();
    
    const lastProductSheet = useRef<{id: null | number, open: boolean}>({
        id: null,
        open: false
    })


    // Bottom Sheet
    const handleOpenInfoProduct = useCallback((idProduct: number) => {
        console.log("Tentando abrir produto:", idProduct);
        
        lastProductSheet.current.id = idProduct;
        lastProductSheet.current.open = true;

        openSheet(
            <InfoProductBottomSheet
                idProduct={idProduct}

            />, 
            ["26%"], 
            false
        );
    }, [openSheet])

    // Fecha bottomSheet ao sair da tela
    useFocusEffect(
        () => {
            return () => closeSheet();
        }
    );

    const {
        addProductToCart,
    } = useCartActions();
    
    
    const addProductHandle = useCallback((product: ProductAndFornecedorData) => {
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
        if (!dataProduct) return [];

        // console.log(JSON.stringify(dataProduct, null, "  "));

        const map = new Map<string, GenericInfiniteListType<ProductCardSimpleProps>>();

        dataProduct.pages.forEach((page) => {
            
            page.list.forEach(p => {
                // console.log(p.nome_fornecedor, p.id_fornecedor, id);
                const idString = p.id_produto.toString();
                
                map.set(idString, {
                    id: idString, 
                    canBuy: p.relationship_status === "ACCEPTED",
                    name: p.nome_prod,
                    price: p.preco,
                    qnt: p.quantidade.toString(),
                    onPress: () => handleOpenInfoProduct(p.id_produto),
                    onPressAddProduct: () => addProductHandle(p)
                });
            });
        });
        return Array.from(map.values());
    }, [dataProduct, handleOpenInfoProduct, addProductHandle]);
    

    // Flast List
    const renderItem = useCallback(
        ({item} : {item: ProductCardSimpleProps}) => (
            <MemoProductCardSimple
                {...item}
            />
        ),
        []
    );


    // Flast List
    const renderItemSkeleton = useCallback(
        () => (
            <MemoProductCardSimpleSkeleton/>
        ), []
    );



    useErrorScreenListener(isErrorProduct, errorProduct, setErrorType);

    return (
        <ScreenErrorGuard errorType={errorType} onRetry={refetchProduct}>
            <SearchInputList
                inputValue={typingText}
                onSubmit={handleSearch}
                placeholder={"Nome do Produto..."}
                setInputValue={setTypingText}
            />

            <GenericInfiniteList
                data={listProds}
                renderItem={renderItem}
                
                keyExtractor={(i) => i.id.toString()}
                onRefresh={refetchProduct}
                
                isLoading={isLoadingProduct}
                isRefetching={isRefetchingProduct}
                
                isFetchingNextPage={isFetchingNextPageProduct}
                SkeletonComponent={<MemoProductCardSimpleSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                }}
                onEndReached={() => {
                    if(hasNextPageProduct && !isFetchingNextPageProduct) {
                        fetchNextPageProduct();
                    }
                }}
                hasSeparator={false}
                hasBorderSeparator={true}
            />
        </ScreenErrorGuard>
    );
}

