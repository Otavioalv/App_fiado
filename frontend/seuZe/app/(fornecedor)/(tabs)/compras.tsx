import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { MemoShoppingCardFornecedor, MemoShoppingCardFornecedorSkeleton, ShoppingCardFornecedorProps } from "@/src/components/common/ShoppingCardFornecedor";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { useShoppingList } from "@/src/hooks/useFornecedorQueries";
import { TypeShoppingList } from "@/src/types/responseServiceTypes";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";


const chipList:ChipDataType<TypeShoppingList>[] = [
    {
        id: "all",
        label: "Todos"
    }, 
    {
        id: "analysis",
        label: "Em Análise"
    },
    {
        id: "wait_remove",
        label: "Aguardando Retirada"
    },
    {
        id: "removed",
        label: "Retirados"
    },
    {
        id: "paid",
        label: "Quitado"
    }, 
    {
        id: "pending",
        label: "Pendente"
    }, 
    {
        id: "refused",
        label: "Recusado"
    },
    {
        id: "canceled",
        label: "Cancelado"
    }
];


export default function Compras() {
    const router = useRouter();
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
    } = useFilterScreen<TypeShoppingList>("all");

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
    } = useShoppingList(
        {
            search: searchQuery,
            filter: filter,
        },
        activeCategory
    );


    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    const handleOnPress = useCallback((id: string | number) => {
        router.push({
            pathname: `/compras/[id]`,
            params: {id: id}
        });
    }, [router])

    const listShopping = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<ShoppingCardFornecedorProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_compra?.toString() || Math.random().toString();
                map.set(idString, {
                    id: idString,
                    nome: u.nome_user,
                    price: Number(u.valor_unit) * u.quantidade,
                    prodName: u.nome_produto,
                    shoppingStatus: u.shopping_status,
                    paymentStatus: u.payment_status,
                    quantidade: u.quantidade,
                    valorUnit: u.valor_unit,
                    prazo: new Date(u.prazo),
                    apelido: u.apelido_user,
                    criadoEm: new Date(u.created_at),
                    isClient: false,
                    onPress: () => handleOnPress(idString),
                });
            });
        });

        return Array.from(map.values());
    }, [data, handleOnPress]);

    const renderItem = useCallback(
        ({item}: {item: ShoppingCardFornecedorProps}) => (
            <MemoShoppingCardFornecedor
                {...item}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
            <View>
                <MemoShoppingCardFornecedorSkeleton/>
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
                placeholder="Nome, Apelido..."
            />

            <GenericInfiniteList
                SkeletonComponent={<MemoShoppingCardFornecedorSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                    HeaderComponent: <ChipListSkeleton/>
                }}
                data={listShopping}
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
                HeaderComponent={
                    <ChipList
                        chipList={chipList}
                        itemSelected={activeCategory} 
                        setItemSelected={setActiveCategory}
                    />
                }
                emptyMessage={"Nenhuma compra encontrada"}
            />
        </ScreenErrorGuard>
    )
}
