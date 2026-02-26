import EmptyState from "@/src/components/common/EmptyState";
import LastActivities, { InfoType } from "@/src/components/common/LastActivities";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { QuickShortcuts, ShortcutsType } from "@/src/components/common/QuickShortcuts";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import { useListMessages, useListPartner, useMe, useShoppingList } from "@/src/hooks/useClienteQueries";
import { mapAppErrorToErrorType } from "@/src/hooks/useErrorScreenListener";
import { useFilterCategoryStore } from "@/src/stores/cliente/fornecedores.store";
import { theme } from "@/src/theme";
import { ErrorTypes} from "@/src/types/responseServiceTypes";
import { transformDateToUI } from "@/src/utils";
import {Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";


export default function Home() {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const {request: setCategoryFornecedores} = useFilterCategoryStore();
    
    const router = useRouter();


    const {
        data: dataMessages,
        refetch: fetchMessages,
        isError, 
        error, 
        isLoading,
        isRefetching,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
    } = useListMessages(
        {
            page: 1,
            size: 1
        },
        "unread"
    );
    
    const shortcuts: ShortcutsType[] = [
        {   
            idSh: "1",
            title: "Fornecedores", 
            icon: <Feather name="truck" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/fornecedores")

        }, 
        {
            idSh: "7",
            title: "Carinho", 
            icon: <Feather name="shopping-cart" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/shopping_cart")
        },
        {
            idSh: "2",
            title: "Minhas Parcerias", 
            icon: <Feather name="users" size={32} color={theme.colors.orange}/>,
            onPress: () => {
                setCategoryFornecedores("accepted");
                router.push("/fornecedores");
            }

        }, 
        {
            idSh: "3",
            title: "Produtos", 
            icon: <Feather name="package" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/produtos")
        }, 
        {
            idSh: "4",
            title: "Minhas Compras", 
            icon: <Feather name="shopping-bag" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/compras")

        }, 
        {
            idSh: "5",
            title: "Notificações", 
            icon: <Feather name="bell" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/notificacoes")
        }
    ];

    const {
        data: userData,
        isLoading: meLoad,
        refetch: fetchMe
    } = useMe();

    const {
        data: lastPurchased,
        isLoading: purchasedLoad,
        refetch: fetchShoppingList
    } = useShoppingList({
        filter: "Mais Recente",
    }, "all", 10);

    const {
        data: lastPartnerSent,
        isLoading: lastPartnerLoad,
        refetch: fetchPartnerSent
    } = useListPartner({
        filter: "Data",
    }, "sent", 10);

    const listPurchased:InfoType[] = useMemo((): InfoType[] => {
            const list = lastPurchased?.pages?.[0]?.list;

            // console.log(JSON.stringify(list, null, "  "));
            
            if(!list) return [];

            const info:InfoType[] = list.map(l => ({
                id: l.id_compra.toString(),
                title: l.nome_produto,
                info: `Criado em ${transformDateToUI(l.created_at || "")}`
            }));

            return info
            // return []

    }, [lastPurchased]);

    const listPartners: InfoType[] = useMemo(():InfoType[] => {
        const list = lastPartnerSent?.pages?.[0]?.list;

        if(!list) return [];

        const info:InfoType[] = list.map(l => {
            let dateInfo = "";

            if(l.created_at) {
                dateInfo = `Enviado em ${transformDateToUI(l.created_at)}`;
            }

            return {
                id: l.id_fornecedor.toString(),
                info: dateInfo,
                title: l.nome
            }
        });
        
        return info;
    }, [lastPartnerSent]);
 



    // Carrega os dados
    const loadData = useCallback(async () => {
        try {
            setErrorType(null);
            setRefreshing(true);
            // Fazer requsições pararem quando uma der erro;
            await Promise.all([
                fetchMe({ throwOnError: true }),
                fetchShoppingList({ throwOnError: true }),
                fetchPartnerSent({ throwOnError: true }),
                fetchMessages({throwOnError: true}),
            ]);

        } catch(err) {
            const errorHandled: ErrorTypes = mapAppErrorToErrorType(err);
            setErrorType(errorHandled);
        }  finally {
            setRefreshing(false);
        }
    }, [fetchMe, fetchShoppingList, fetchPartnerSent, fetchMessages]);
    
    return (
        <ScreenErrorGuard errorType={errorType} onRetry={loadData}>
            <ScrollView
                contentContainerStyle={{flexGrow: 1}}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        tintColor={theme.colors.orange}
                        onRefresh={loadData}
                        colors={[theme.colors.orange]}
                        progressBackgroundColor={"#FFFFFF"}
                    />
                }   
            >   
                <UserHeader 
                    nome={userData?.nome || ""} 
                    apelido={userData?.apelido || ""}
                    isLoading={meLoad}
                    hasNotification={!!dataMessages?.pages[0].list.length}
                />

                <MyScreenContainer>
                    <SectionContainer title="Atalhos Rápidos">
                        <QuickShortcuts shortcuts={shortcuts}/>
                    </SectionContainer>

                    <SectionContainer title="Últimas Atividades">
                        <LastActivities 
                            title={"Últimas Compras"} 
                            infos={listPurchased} 
                            // infos={[]} 
                            isLoading={purchasedLoad}
                            emptyStateComponent={
                                <EmptyState
                                    title={"Você ainda não fez compras"}
                                    description={"Suas compras aparecerão aqui quando vocẽ coletar um produto."}
                                    iconName={"package"}
                                    primaryAction={{
                                        label: "Ver Produtos",
                                        onPress: () => router.push("/produtos")
                                    }}
                                    secondaryAction={{
                                        label: "Explorar Fornecedores",
                                        onPress: () => router.push("/fornecedores")
                                    }}
                                />
                            }
                        />
                        <LastActivities 
                            title={"Últimas parcerias pendentes"} 
                            infos={listPartners} 
                            // infos={[]} 
                            isLoading={lastPartnerLoad}
                            emptyStateComponent={
                                <EmptyState
                                    title={"Você não tem parcerias pendentes"}
                                    description={"Suas parcerias pendentes aparecerão aqui quando você solicitar uma parceria."}
                                    iconName={"truck"}
                                    primaryAction={{
                                        label: "Fornecedores",
                                        onPress: () => router.push("/fornecedores")
                                    }}
                                    secondaryAction={{
                                        label: "Explorar Compras",
                                        onPress: () => router.push("/compras")
                                    }}
                                />
                            }
                        />
                    </SectionContainer>
                </MyScreenContainer>
            </ScrollView>
        </ScreenErrorGuard>
    );
}
