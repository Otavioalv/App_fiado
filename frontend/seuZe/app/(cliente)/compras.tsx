import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import FeedbackError from "@/src/components/common/FeedbackError";
import { ListShoppingProd, ListShoppingProdSkeleton, ListShoppingType } from "@/src/components/common/ListShoppingProd";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { AppError } from "@/src/errors/AppError";
import { useShoppingList } from "@/src/hooks/useClienteQueries";
import { ErrorTypes, OnSubmitSearchType, TypeShoppingList } from "@/src/types/responseServiceTypes";
import { transformDateToUI } from "@/src/utils";
import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";


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
        id: "wait_remove",
        label: "Aguardando Retirada"
    },
    {
        id: "canceled",
        label: "Cancelado"
    }
];


export default function Compras() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [typingText, setTypingText] = useState<string>("");
    const [filterQuery, setFilterQuery] = useState<string>("");
    const [filter, setFilter] = useState<string>("");
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const [activeCategory, setActiveCategory] = useState<TypeShoppingList>("all");

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

    // console.log(JSON.stringify(data, null, "  "));

    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listShopping = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, ListShoppingType>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_compra?.toString() || Math.random().toString();
                
                let dateValue = transformDateToUI(u.prazo);
                let createdAtValue = transformDateToUI(u.created_at);

                map.set(idString, {
                    id: idString,
                    marketName: u.nomeestabelecimento,
                    nome: u.nome_user,
                    price: u.valor_unit,
                    prodName: u.nome_produto,
                    status: u.shopping_status,
                    prazo: dateValue,
                    apelido: u.apelido_user,
                    paid: u.quitado,
                    criadoEm: createdAtValue
                });

                // console.log(map);
            });
        });

        return Array.from(map.values());
    }, [data]);

    const searchOnList: OnSubmitSearchType = (txtSearch: string, txtFilter: string = "") => {
        Keyboard.dismiss();
        console.log(txtFilter, txtSearch);
        setErrorType(null);
        setTypingText(txtSearch.trim());
        setSearchQuery(txtSearch.trim());

        setFilter(txtFilter.trim());
        setFilterQuery(txtFilter.trim());
    }
    
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

    

    return(
        <>
            <SearchInputList
                filterList={currentFilterList}
                onSubmit={searchOnList}
                inputValue={typingText}
                setInputValue={setTypingText}
                filterValue={filter.length ? filter : currentFilter}
                setFilterValue={setFilter}
                placeholder="Nome, Apelido, Estabelecimento, Produto..."
            />

            {isLoading ? 
                <ListShoppingProdSkeleton headerComponent={<ChipListSkeleton/>}/> : (
                <ListShoppingProd
                    data={listShopping}
                    refreshing={isRefetching}
                    onRefresh={refetch}
                    isFetchingNextPage={isFetchingNextPage}
                    onEndReached={() => {
                        if(hasNextPage && !isFetchingNextPage) {
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
