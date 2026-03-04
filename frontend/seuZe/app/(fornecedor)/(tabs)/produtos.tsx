import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { MemoProductCardFornecedor, MemoProductCardFornecedorSkeleton, ProductCardFornecedorProps } from "@/src/components/common/ProductCardFornecedor";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { useProductList } from "@/src/hooks/useFornecedorQueries";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { View } from "react-native";


export default function Produtos() {
    const router = useRouter();

    const {
        searchQuery,
        filter,
        typingText,
        handleSearch,
        errorType,
        setErrorType,
        setTypingText,
        setFilter,
    } = useFilterScreen<null>(null);

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
    );

    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    const handleOnPressEdit = useCallback((id: string | number) => {
        router.push({
            pathname: `/produtos/[id]`,
            params: {id: id}
        });
    }, [router])

    const listProds = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<ProductCardFornecedorProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_produto.toString();

                // const fornecedorName: string = `${u.nome_fornecedor}${u.apelido ? ` - (${u.apelido})` : ""}`;

                map.set(idString, {
                    prodName: u.nome,
                    price: u.preco,
                    id: idString,
                    idProduct: idString,
                    quantity: u.quantidade,
                    onPressEditFunction: () => handleOnPressEdit(idString)
                });
            });
        });
        return Array.from(map.values());
    }, [data, handleOnPressEdit]);


    const renderItem = useCallback(
        ({item}: {item: ProductCardFornecedorProps}) => (
            <MemoProductCardFornecedor
                {...item}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
            <View>
                <MemoProductCardFornecedorSkeleton/>
            </View>
    ), []);

    const HeaderComponent = () => (
        <View style={{
            alignItems: "flex-end"
        }}>
            <ButtonModern
                placeholder="Adicionar produtos"
                onPress={() => router.push("/produtos/add")}
                variant="ghost"
                size="S"
            />
        </View>
    );


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
                placeholder="Nome do produto"
            />
            <GenericInfiniteList
                SkeletonComponent={<MemoProductCardFornecedorSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                }}
                data={listProds}
                renderItem={renderItem}
                isFetchingNextPage={isFetchingNextPage}
                isLoading={isLoading}
                isRefetching={isRefetching}
                keyExtractor={(i) => i.id.toString()}
                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage();
                    }
                }}
                onRefresh={refetch}
                emptyMessage={"Nenhum produto encontrado"}
                HeaderComponent={
                    <HeaderComponent/>
                }
            />
        </ScreenErrorGuard>
    )
}