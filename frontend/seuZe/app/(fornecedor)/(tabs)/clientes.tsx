import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { InfoClienteBottomSheet } from "@/src/components/common/InfoClienteBottomSheet";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { MemoUserCard, MemoUserCardSkeleton, UserCardProps } from "@/src/components/common/UserCard";
import { OnPressActionFunctionType } from "@/src/components/ui/RelationshipActions";
import { useGlobalBottomModalSheet } from "@/src/context/globalBottomSheetModalContext";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { useListPartner, useUpdatePartnerFornecedorStatus } from "@/src/hooks/useFornecedorQueries";
import { useFilterCategoryStore } from "@/src/stores/cliente/clientes.store";
import { FilterType, TypeUserList } from "@/src/types/responseServiceTypes";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo } from "react";

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

export default function Cliente() {
    // const router = useRouter();

    const {
        searchQuery,
        filter,
        typingText,
        activeCategory,
        errorType,
        
        setErrorType,
        setActiveCategory,
        setTypingText,
        setFilter,

        handleSearch, 
    } = useFilterScreen<TypeUserList>("all");

    const filters = useMemo<FilterType>(() => ({
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
    } = useListPartner(
        filters,
        activeCategory
    );  

    const { openSheet, closeSheet } = useGlobalBottomModalSheet();

    const handleOpenInfoCliente = useCallback((idCliente: number | string) => {
        openSheet(
            <InfoClienteBottomSheet idCliente={idCliente}/>,
            ['28%'],
            false
        );
    }, [openSheet])

    // Fecha o bottom sheet ao sair da tela.
    useFocusEffect(
        useCallback(() => {
            return () => closeSheet();
        }, [closeSheet])
    );


    const {consume, requestedCategory} = useFilterCategoryStore();

    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    const {mutate} = useUpdatePartnerFornecedorStatus(filters, activeCategory);

    const handleAction: OnPressActionFunctionType = useCallback(({ id, newStatus }) => {
        mutate({ id: id, newStatus: newStatus });
    }, [mutate]);
 
    const listUsers = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<UserCardProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_cliente?.toString();
                const description: string = `${u.apelido ? `${u.apelido}` : ""}`;

                let dateValue = ""
                if(u.created_at) {
                    const dataObj = new Date(u.created_at);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

                    dateValue = `${day}/${month}`;
                }

                map.set(idString, {
                    title: u.nome,
                    description: description,
                    id: idString,
                    idUser: idString,
                    relationshipType: u.relationship_status ?? 'NONE',
                    date: dateValue,
                    isClient: false,
                    onPress: () => handleOpenInfoCliente(idString),
                    onPressActionFunction: handleAction,
                    // onPressAccepted: handleOnPressAccepted,
                    // onPress: () => router.push(`/fornecedores/${u.id_fornecedor}`)
                });
            });
        });

        return Array.from(map.values());
    }, [data, handleOpenInfoCliente, handleAction]);

    const renderItem = useCallback(
        ({item}: {item: UserCardProps}) => (
            <MemoUserCard
                {...item}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
        <MemoUserCardSkeleton/>
    ), []);

    useErrorScreenListener(isError, error, setErrorType);

    useEffect(() => {
        console.log(requestedCategory);
        if(requestedCategory) {
            setActiveCategory(requestedCategory);
            consume();
        }
    }, [consume, requestedCategory, setActiveCategory]);

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
                SkeletonComponent={<MemoUserCardSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                    HeaderComponent: <ChipListSkeleton/>
                }}
                data={listUsers}
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
                emptyMessage={"Nenhum usuário encontrado"}
            />
        </ScreenErrorGuard>
    )
}
