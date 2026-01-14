import { ListUsers, ListUsersSkeleton, ListUsersType } from "@/src/components/common/ListUsers";
import { OnSubmitSearchType, SearchInputList } from "@/src/components/common/SearchInputList";
import { useListAllFornecedores } from "@/src/hooks/useClienteQueries";
import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

export default function Fornecedores() {
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string>("");

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
        isRefetching
    } = useListAllFornecedores({
        search: search,
        filter: filter,
    });

    const currentFilterList: string[] | undefined = data?.pages[0].pagination.filterList;
    const currentFilter: string | undefined = data?.pages[0].pagination.filter;
    
    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listUsers = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, ListUsersType>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_fornecedor?.toString() || Math.random().toString();
                const description: string = `${u.nome}${u.apelido ? ` - (${u.apelido})` : ""}, ${u.uf}`;
                
                map.set(idString, {
                    title: u.nomeestabelecimento,
                    description: description,
                    id: idString,
                    relationshipType: u.relationship_status ?? 'NONE',
                });
            });
        });

        return Array.from(map.values());
    }, [data]);


    const searchOnList: OnSubmitSearchType = (txtSearch: string, txtFilter: string = "") => {
        Keyboard.dismiss();
        setSearch(txtSearch.trim())
        setFilter(txtFilter.trim());
    }

    return(
        <>  
            <SearchInputList
                // hasFilter={!!currentFilterList}
                filterList={currentFilterList}
                onSubmit={searchOnList}
                inputValue={search}
                setInputValue={setSearch}
                filterValue={filter.length ? filter : currentFilter}
                setFilterValue={setFilter}
                placeholder="Buscar por nome, apelido ou endereço..."

            />

            {isLoading ? 
                <ListUsersSkeleton/> : (
                <ListUsers
                    data={listUsers}
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={() => {
                        if (hasNextPage && !isFetchingNextPage) {
                            fetchNextPage();
                        }
                    }}
                />
            )}
        </>
    );
}
