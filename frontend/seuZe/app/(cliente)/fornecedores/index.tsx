import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { MemoUserCard, MemoUserCardSkeleton, UserCardProps } from "@/src/components/common/UserCard";
import { useListPartner } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useFilterScreen } from "@/src/hooks/useFilterScreen";
import { TypeUserList } from "@/src/types/responseServiceTypes";
import { useCallback, useEffect, useMemo } from "react";
import { useFilterCategoryStore } from "@/src/stores/cliente/fornecedores.store";
import { useRouter } from "expo-router";

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

export default function Fornecedores() {
    // const {type} = useLocalSearchParams<{type: TypeUserList}>();
    const router = useRouter();

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
        {
            search: searchQuery,
            filter: filter,
        },
        activeCategory
    );

    const {consume, requestedCategory} = useFilterCategoryStore();


    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;


    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listUsers = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, GenericInfiniteListType<UserCardProps>>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_fornecedor?.toString();
                const description: string = `${u.nome}${u.apelido ? ` - (${u.apelido})` : ""}, ${u.uf}`;

                let dateValue = ""
                if(u.created_at) {
                    const dataObj = new Date(u.created_at);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

                    dateValue = `${day}/${month}`;
                }

                map.set(idString, {
                    title: u.nomeestabelecimento,
                    description: description,
                    id: idString,
                    relationshipType: u.relationship_status ?? 'NONE',
                    date: dateValue,
                    onPress: () => router.push(`/(cliente)/fornecedores/${u.id_fornecedor}`)
                });
            });
        });

        return Array.from(map.values());
    }, [data, router]);


    const renderItem = useCallback(
        ({item}: {item: UserCardProps}) => (
            <MemoUserCard 
                title={item.title} 
                description={item.description} 
                relationshipType={item.relationshipType}
                date={item.date}
                onPress={item.onPress}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
        <MemoUserCardSkeleton/>
    ), []);

    useErrorScreenListener(isError, error, setErrorType);


    useEffect(() => {
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
    ); 
}
