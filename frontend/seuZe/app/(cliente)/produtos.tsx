import { ChipDataType, ChipList, ChipListSkeleton } from "@/src/components/common/ChipList";
import FeedbackError from "@/src/components/common/FeedbackError";
import { ListProducts, ListProductsSkeleton, ListProductsType } from "@/src/components/common/ListProducts";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { SearchInputList } from "@/src/components/common/SearchInputList";
import { AppError } from "@/src/errors/AppError";
import { useProductList } from "@/src/hooks/useClienteQueries";
import { ErrorTypes, OnSubmitSearchType, TypeUserList } from "@/src/types/responseServiceTypes";
import { useEffect, useMemo, useState } from "react";
import { Keyboard } from "react-native";

export default function Produtos() {
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
    } = useProductList(
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
    const listProds = useMemo(() => {
        if (!data) return [];

        const map = new Map<string, ListProductsType>();

        data.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_produto?.toString() || Math.random().toString();

                const fornecedorName: string = `${u.nome_fornecedor}${u.apelido ? ` - (${u.apelido})` : ""}`;

                map.set(idString, {
                    prodName: u.nome_prod,
                    price: u.preco,
                    marketName: u.nomeestabelecimento,
                    fornecedorName: fornecedorName,
                    relationshipType: u.relationship_status,
                    id: idString,
                });
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
                placeholder="Buscar por nome, apelido, estabelecimento"
            />


            {isLoading ? 
                <ListProductsSkeleton headerComponent={<ChipListSkeleton/>}/> : (
                <ListProducts
                    data={listProds}
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
    )
}
