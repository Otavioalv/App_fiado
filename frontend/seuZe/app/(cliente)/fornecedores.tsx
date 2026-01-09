import { ListUsers, ListUsersSkeleton, ListUsersType } from "@/src/components/common/ListUsers";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { useListAllFornecedores } from "@/src/hooks/useClienteQueries";
import { useMemo } from "react";

export default function Fornecedores() {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch,
        isLoading,
        isRefetching
    } = useListAllFornecedores({
        filter: "",
        search: ""
    });
    
    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listUsers = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, ListUsersType>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_fornecedor?.toString() || Math.random().toString();
                
                map.set(idString, {
                    title: u.nomeestabelecimento,
                    description: `${u.nome}, ${u.uf}`,
                    id: idString,
                    relationshipType: u.relationship_status ?? 'NONE',
                });
            });
        });

        return Array.from(map.values());
    }, [data]);


    const searchOnList = () => {
        console.log("Pesquisar");
    }

    if(isLoading) return <ListUsersSkeleton/>

    return(
        <>  
            {/* <SearchInputList
                hasFilter={false}
                onSubmit={searchOnList}
                placeholder="Buscar por nome, apelido ou endereço"

            /> */}
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
        </>
    );
}
