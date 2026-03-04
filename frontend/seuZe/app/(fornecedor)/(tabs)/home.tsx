import EmptyState from "@/src/components/common/EmptyState";
import LastActivities, { InfoType } from "@/src/components/common/LastActivities";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { QuickShortcuts, ShortcutsType } from "@/src/components/common/QuickShortcuts";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import { mapAppErrorToErrorType } from "@/src/hooks/useErrorScreenListener";
import { useListMessages, useListPartner, useMe, useShoppingList } from "@/src/hooks/useFornecedorQueries";
import { useFilterCategoryStore } from "@/src/stores/cliente/clientes.store";
import { theme } from "@/src/theme";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { transformDateToUI } from "@/src/utils";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView } from "react-native-gesture-handler";


export default function Home() {
    const router = useRouter();
    
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const {request: setCategoryClientes} = useFilterCategoryStore();

    const shortcuts: ShortcutsType[] = [
        {
            idSh: "3",
            title: "Meus Produtos", 
            icon: <Feather name="package" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/produtos")
        }, 
        {
            idSh: "4",
            title: "Compras Solicitadas", 
            icon: <Feather name="shopping-bag" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/compras")

        },
        {   
            idSh: "1",
            title: "Clientes", 
            icon: <Feather name="briefcase" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/clientes")

        }, 
        {
            idSh: "2",
            title: "Minhas Parcerias", 
            icon: <Feather name="users" size={32} color={theme.colors.orange}/>,
            onPress: () => {
                setCategoryClientes("accepted");
                router.push("/clientes");
            }
        }, 
        {
            idSh: "7",
            title: "Perfil", 
            icon: <Feather name="user" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/perfil")
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
        refetch: fetchMe,
    } = useMe();

    const {
        data: lastPurchased,
        isLoading: purchasedLoad,
        refetch: fetchShoppingList
    } = useShoppingList({
        filter: "Mais Recente",
    }, "pending", 10);

    const {
        data: lastPartnerSent,
        isLoading: lastPartnerLoad,
        refetch: fetchPartnerSent
    } = useListPartner({
        filter: "Data",
    }, "sent", 10);

    const {
        data: dataMessages,
        refetch: fetchMessages,
    } = useListMessages(
        {
            page: 1,
            size: 1
        },
        "unread"
    );

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
                id: l.id_cliente.toString(),
                info: dateInfo,
                title: l.nome
            }
        });
        
        return info;
    }, [lastPartnerSent]);


    const loadData = useCallback(async () => {
        try{
            setErrorType(null);
            setRefreshing(true);

            await Promise.all([
                fetchMe({throwOnError: true}),
                fetchShoppingList({throwOnError: true}),
                fetchPartnerSent({throwOnError: true}),
                fetchMessages({throwOnError: true})
            ]);

        }catch(err) {
            const errorHandled: ErrorTypes = mapAppErrorToErrorType(err);
            setErrorType(errorHandled);
        }finally{
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
                            title={"Últimas compras pendentes"}
                            infos={listPurchased} 
                            isLoading={purchasedLoad}
                            emptyStateComponent={
                                <EmptyState
                                    title={"Não existe nada pendente"}
                                    description={"Compras pendentes aparecerão quando um cliente solicitar algum produto"}
                                    iconName={"package"}
                                    // primaryAction={{
                                    //     label: "Ver Produtos",
                                    //     onPress: () => router.push("/produtos")
                                    // }}
                                    // secondaryAction={{
                                    //     label: "Explorar Fornecedores",
                                    //     onPress: () => router.push("/fornecedores")
                                    // }}
                                />
                            }
                        />
                        <LastActivities 
                            title={"Últimas parcerias pendentes"} 
                            infos={listPartners}
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
    )
}
