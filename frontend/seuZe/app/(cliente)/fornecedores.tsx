 import { ListUsers, ListUsersType } from "@/src/components/common/ListUsers";
import { listAllFornecedores } from "@/src/services/clienteService";
import { PaginationType } from "@/src/types/responseServiceTypes";
import { useRef, useState } from "react";


const defaultPagination: PaginationType = {
    page: 1, 
    size: 20
}

export default function Fornecedores() {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    
    const [listUsers, setListUsers] = useState<ListUsersType[]>([]);
    
    // Pagination
    const [myPagination, setMyPagination] = useState<PaginationType>(defaultPagination);

    const isLoading = useRef<boolean>(false);

    const loadInitialData = async () => {
        if(isLoading.current) return;
        
        isLoading.current = true;
        setLoading(true);

        try{
            setListUsers([]);
            setHasMore(true);

            const result = await listAllFornecedores(defaultPagination);
            const {list, pagination} = result;
            
            setMyPagination((prev) => ({
                ...prev,
                page: pagination.page + 1, 
                filter: pagination?.filter,
                filterList: pagination?.filterList,
                search: pagination?.search,
                total: pagination?.total,
                totalPages: pagination?.totalPages,
            }));
            
            const listData:ListUsersType[] = list.map((u) => {
                const description: string = `${u.nome}, ${u.uf}`;

                return {
                    title: u.nomeestabelecimento,
                    description: description,
                    id: u.id_fornecedor.toString(),
                    relationshipType: u.relationship_status ?? "NONE"
                }
            });

            setListUsers(listData);
        }catch(err) {
            console.log(err);
        } finally {
            isLoading.current = false;
            setLoading(false);
        }
    }


    const loadMoreData = async () => {
        if(isLoading.current || !hasMore) {console.log("Carregando"); return};
        if(isLoading.current) return; // requisição em andamento
        if(!hasMore) return; // acabou dados
        setLoading(true);

        try{
            isLoading.current = true;

            console.log("carregado...");

            const result = await listAllFornecedores(myPagination);
            // console.log(JSON.stringify(result, null, "  "));

            const {list, pagination} = result;
            
            // Editar depois
            setMyPagination((prev) => ({
                ...prev,
                page: pagination.page + 1, 
                filter: pagination?.filter,
                filterList: pagination?.filterList,
                search: pagination?.search,
                total: pagination?.total,
                totalPages: pagination?.totalPages,
            }));

            if(list.length > 0) {
                const {size} = myPagination;

                const listData:ListUsersType[] = list.map((u) => {
                    const description: string = `${u.nome}, ${u.uf}`;

                    console.log(u.id_fornecedor,  pagination.total, listUsers.length, pagination.totalPages);

                    return {
                        title: u.nomeestabelecimento,
                        description: description,
                        id: u.id_fornecedor.toString(),
                        relationshipType: u.relationship_status ?? "NONE"
                    }
                });

                setListUsers(prev => [...prev, ...listData]);


                if(list.length < size) 
                    setHasMore(false);
            } else {
                setHasMore(false);
            }
        }catch(err) {
            console.log(err);
        }finally {


            isLoading.current = false;



            setLoading(false);
        }
    }

    const handleEndReached = async() => {
        if(hasMore)
            await loadMoreData();
    }

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadInitialData();
        setRefreshing(false);
    }

    return(
        <ListUsers
            data={listUsers}
            
            // Refresh
            onRefresh={handleRefresh}
            refreshing={refreshing}
            // Carregar mais dados
            onEndReached={handleEndReached}
        />
    );
}
