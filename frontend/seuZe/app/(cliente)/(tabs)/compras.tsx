import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { InfoShoppingBottomSheet } from "@/src/components/common/InfoShoppingBottomSheet";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { MemoShoppingCard, MemoShoppingCardSkeleton, ShoppingCardProps } from "@/src/components/common/ShoppingCard";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { useShoppingList } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { TypeShoppingList } from "@/src/types/responseServiceTypes";
import { useFocusEffect } from "expo-router";
import { useCallback, useMemo } from "react";
import { View } from "react-native";

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

    const {openSheet, closeSheet} = useGlobalBottomModalSheet();

    const handleOpenInfoShopping = useCallback((idShopping: number) => {
        console.log("abri bottom sheet");

        openSheet(
            <InfoShoppingBottomSheet 
                idShopping={idShopping}
            />,
            ["30%"],
            false
        );
    }, [openSheet]);

    // Fecha o bottom sheet ao sair da tela.
    useFocusEffect(
        useCallback(() => {
            return () => closeSheet();
        }, [closeSheet])
    );


    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listShopping = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<ShoppingCardProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_compra?.toString() || Math.random().toString();
                
                // let dateValue = transformDateToUI(u.prazo);
                // let createdAtValue = transformDateToUI(u.created_at);

                map.set(idString, {
                    id: idString,
                    marketName: u.nomeestabelecimento,
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
                    onPress: () => handleOpenInfoShopping(u.id_compra),
                });
                // console.log(map);
            });
        });

        return Array.from(map.values());
    }, [data, handleOpenInfoShopping]);

    const renderItem = useCallback(
        ({item}: {item: ShoppingCardProps}) => (
            <MemoShoppingCard
                {...item}
                
                // marketName={item.marketName}
                // nome={item.nome}
                // price={item.price}
                // prodName={item.prodName}
                // shoppingStatus={item.shoppingStatus}
                // paymentStatus={item.paymentStatus}
                // apelido={item.apelido}
                // prazo={item.prazo}
                // criadoEm={item.criadoEm}
                // quantidade={item.quantidade}
                // valorUnit={item.valorUnit}
                // onPress={item.onPress}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
            <View>
                <MemoShoppingCardSkeleton/>
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
                SkeletonComponent={<MemoShoppingCardSkeleton/>}
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
    ); 
}
