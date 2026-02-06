import { useProductListFromId } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useMemo, useRef } from "react";
import { MemoProductCardSimple, MemoProductCardSimpleSkeleton, ProductCardSimpleProps } from "../../common/ProductCardSimple";
import { GenericInfiniteList, GenericInfiniteListType } from "../../common/GenericInfiniteList";
import { ScreenErrorGuard } from "../../common/ScreenErrorGuard";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { SearchInputList } from "../../common/SearchInputList";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { InfoProductBottomSheet } from "../../common/InfoProductBottomSheet";


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

    // Bottom Sheet
    useFocusEffect(
        useCallback(() => {
            // requestAnimationFrame(() => {
            //     console.log("focou: ", lastProductSheet.current);
            //     if(lastProductSheet.current.open && lastProductSheet.current.id) {
            //         handleOpenInfoProduct(lastProductSheet.current.id);
            //         clearLastProduct();
            //     }
            // });
            return () => {
                console.log("Deu close sheet: ", lastProductSheet.current);
                closeSheet();
            }
        }, [closeSheet])
    );

    
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
                    onPress: () => handleOpenInfoProduct(p.id_produto)
                });
            });
        });
        return Array.from(map.values());
    }, [dataProduct, handleOpenInfoProduct]);
    

    // Flast List
    const renderItem = useCallback(
        ({item} : {item: ProductCardSimpleProps}) => (
            <MemoProductCardSimple
                name={item.name}
                canBuy={item.canBuy}
                price={item.price}
                qnt={item.qnt}
                onPress={item.onPress}
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

