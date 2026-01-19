import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import FeedbackError from "@/src/components/common/FeedbackError";
import { ListUsers, ListUsersSkeleton, ListUsersType } from "@/src/components/common/ListUsers";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { AppError } from "@/src/errors/AppError";
import { useListPartner } from "@/src/hooks/useClienteQueries";
import { ErrorTypes, OnSubmitSearchType, TypeUserList } from "@/src/types/responseServiceTypes";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

export default function Fornecedores() {
    const { type } = useLocalSearchParams<{ type?: TypeUserList }>();
    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [typingText, setTypingText] = useState<string>("");
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const [activeCategory, setActiveCategory] = useState<TypeUserList>("all");

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
                    date: dateValue
                });
            });
        });

        return Array.from(map.values());
    }, [data]);

    useEffect(() => {
        if(isError) {
            if(error instanceof AppError){
                const {message, type} = error;
                
                console.log("[Load List] Erro: ", message);
                console.log("[Load List] Type: ", type);
                console.log("\n");
    
                setErrorType(type);
            }
            else {
                console.log("[Load List] Erro Desconhecido: ", error, "\n");
                setErrorType("UNKNOWN");
            }
        }
    }, [isError, error]);



    useEffect(() => {
        const TYPE: TypeUserList[] = ["all", "accepted", "none", "sent", "received"];

        if(type && TYPE.includes(type as TypeUserList)) {
            setActiveCategory(type);
            router.setParams({type: ""});
        }
    }, [type, router]);



    const searchOnList: OnSubmitSearchType = (txtSearch: string, txtFilter: string = "") => {
        Keyboard.dismiss();
        console.log(txtFilter, txtSearch);
        setErrorType(null);
        setTypingText(txtSearch.trim());
        setSearchQuery(txtSearch.trim());

        setFilter(txtFilter.trim());
        setFilterQuery(txtFilter.trim());
    }

    if(errorType) {
        return (
            <MyScreenContainer>
                <FeedbackError
                    errorType={errorType}
                    onAction={() => searchOnList(searchQuery, filterQuery)}
                />
            </MyScreenContainer>
        )
    }

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


    return(
        <>  
            <SearchInputList
                filterList={currentFilterList}
                onSubmit={searchOnList}
                inputValue={typingText}
                setInputValue={setTypingText}
                filterValue={filter.length ? filter : currentFilter}
                setFilterValue={setFilter}
                placeholder="Buscar por nome, apelido, estabelecimento"
            />

            {isLoading ? 
                <ListUsersSkeleton headerComponent={<ChipListSkeleton/>}/> : (
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

                    headerComponent={
                        <ChipList 
                            chipList={chipList}
                            itemSelected={activeCategory} 
                            setItemSelected={setActiveCategory}
                        />
                    }
                />
            )}
        </>
    );
}
