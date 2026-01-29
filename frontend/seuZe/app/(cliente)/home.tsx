import EmptyState from "@/src/components/common/EmptyState";
import LastActivities, { InfoType } from "@/src/components/common/LastActivities";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { QuickShortcuts, ShortcutsType } from "@/src/components/common/QuickShortcuts";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import { AppError } from "@/src/errors/AppError";
import { useListPartner, useMe, useShoppingList } from "@/src/hooks/useClienteQueries";
import { useFilterCategoryStore } from "@/src/stores/cliente/fornecedores.store";
import { theme } from "@/src/theme";
import { ErrorTypes} from "@/src/types/responseServiceTypes";
import { transformDateToUI } from "@/src/utils";
import {Feather, FontAwesome} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";


export default function Home() {
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const {request: setCategoryFornecedores} = useFilterCategoryStore();
    
    const router = useRouter();
    
    const shortcuts: ShortcutsType[] = [
        {   
            idSh: "1",
            title: "Fornecedores", 
            icon: <Feather name="truck" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/fornecedores")

        }, 
        {
            idSh: "2",
            title: "Minhas Parcerias", 
            icon: <FontAwesome name="handshake-o" size={32} color={theme.colors.orange}/>,
            onPress: () => {
                setCategoryFornecedores("accepted");
                router.push("/(cliente)/fornecedores");
            }

        }, 
        {
            idSh: "3",
            title: "Produtos", 
            icon: <Feather name="package" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/produtos")
        }, 
        {
            idSh: "4",
            title: "Minhas Compras", 
            icon: <Feather name="shopping-cart" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/compras")

        }, 
        {
            idSh: "5",
            title: "Notificações", 
            icon: <Feather name="bell" size={32} color={theme.colors.orange}/>,
            onPress: () => Alert.alert("Teste", "Vai para lista de notificações")
        }, 
        {
            idSh: "6",
            title: "Meu Perfil", 
            icon: <Feather name="user" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/perfil")
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
            ]);

        } catch(err) {
            if(err instanceof AppError){
                const {message, type} = err;
                console.log("[Load Data] Erro: ", message);
                console.log("[Load Data] Type: ", type);
                console.log("\n");

                setErrorType(type);
            }
            else {
                console.log("[Load Data] Erro Desconhecido: ", err, "\n");
                setErrorType("UNKNOWN");
            }
        }  finally {
            setRefreshing(false);
        }
    }, [fetchMe, fetchShoppingList, fetchPartnerSent]);
    
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
                                        onPress: () => router.push("/(cliente)/produtos")
                                    }}
                                    secondaryAction={{
                                        label: "Explorar Fornecedores",
                                        onPress: () => router.push("/(cliente)/fornecedores")
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
                                        onPress: () => router.push("/(cliente)/fornecedores")
                                    }}
                                    secondaryAction={{
                                        label: "Explorar Compras",
                                        onPress: () => router.push("/(cliente)/compras")
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
