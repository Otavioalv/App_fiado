import EmptyState from "@/src/components/common/EmptyState";
import LastActivities, { InfoType } from "@/src/components/common/LastActivities";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { QuickShortcuts, ShortcutsType } from "@/src/components/common/QuickShortcuts";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import Loading from "@/src/components/ui/Loading";
import { AppError } from "@/src/errors/AppError";
import { me, partnarSent, shoppingList } from "@/src/services/clienteService";
import { theme } from "@/src/theme";
import { DefaultUserDataType, PaginationType } from "@/src/types/responseServiceTypes";
import {Feather, FontAwesome} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, RefreshControl, ScrollView } from "react-native";


export default function Home() {
    const [userData, setUserData] = useState<DefaultUserDataType>({nome: "", telefone: ""});
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const [lastPuschases, setLastPuschases] = useState<InfoType[]>([]);
    const [purchaceLoad, setPurchaceLoad] = useState<boolean>(true);

    const [lastPartnerSent, setLastPartnerSent] = useState<InfoType[]>([]);
    const [lastPartnerLoad, setLastPartnerLoad] = useState<boolean>(true);

    const [refreshing, setRefreshing] = useState<boolean>(false);

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
            onPress: () => Alert.alert("Teste", "Vai para menu de parcerias, em fornecedores")

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
    
    const fetchMe = useCallback(async () => {
        try {
            setIsLoading(true);
            const result:DefaultUserDataType = await me();   
            setUserData(result);
        }catch(err: any) {
            const error = err as AppError;
            
            console.log("ME: ", error.message);
        }finally{
            setIsLoading(false);
        }
    }, []);


    const fetchShoppingList = useCallback(async () => {
        try {
            setPurchaceLoad(true);

            const pagination: PaginationType = {
                page: 1,
                size: 10, 
                filter: "Mais Recente"
            }

            // chama a api
            const result = await shoppingList(pagination);

            if(result.list.length){
                const infoData:InfoType[] = result.list.map((r, i) => {
                    const dataObj = new Date(r.coletado_em);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");
                    return {
                        title: r.nome_produto,
                        info: `Coletado em ${day}/${month}`,
                        id: i.toString()
                    }
                });

                setLastPuschases([...infoData]);
            }
        } catch(err) {
            console.log("ERRO: ", err);
        }finally {
            setPurchaceLoad(false);
        }
    }, []);

    const fetchPartnerSent = useCallback(async () => {
        try{
            setLastPartnerLoad(true);

            const pagination: PaginationType = {
                size: 10,
                page: 1
            }

            const result = await partnarSent(pagination);
            // console.log(JSON.stringify(result, null, "  "));

            if(result.list.length) {
                const infoData:InfoType[] = result.list.map((r, i) => {
                    const dataObj = new Date(r.created_at);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

                    return {
                        title: r.nome,
                        info: `Enviado em ${day}/${month}`,
                        id: i.toString()
                    }
                });

                setLastPartnerSent(infoData);
            }
        } catch(err) {
            console.log("ERRO: ", err);
        }finally {
            setLastPartnerLoad(false);
        }
    }, []);

    const loadData = useCallback(async () => {
        await Promise.all([
            fetchMe(),
            fetchShoppingList(),
            fetchPartnerSent(),
        ]);
    }, [fetchMe, fetchShoppingList, fetchPartnerSent]);

    const onRefresh = async () => {
        setRefreshing(true);
        
        try {
            await loadData();
        } catch(err) {
            console.log("ERRO: ", err);
        }finally {
            setRefreshing(false);
        }
    }

    useEffect(() => {
        loadData();
    }, [loadData]);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    tintColor={theme.colors.orange}
                    onRefresh={onRefresh}
                    colors={[theme.colors.orange]}
                    progressBackgroundColor={"#FFFFFF"}
                />
            }   
        >
            {/* <Loading visible={isLoading}/> */}
            <UserHeader 
                nome={userData.nome} 
                apelido={userData.apelido}
                isLoading={isLoading}
            />
            <MyScreenContainer>
                
                <SectionContainer title="Atalhos Rápidos">
                    <QuickShortcuts shortcuts={shortcuts}/>
                </SectionContainer>

                <SectionContainer title="Últimas Atividades">
                    <LastActivities 
                        title={"Últimas Compras"} 
                        infos={lastPuschases} 
                        // infos={[]} 
                        isLoading={purchaceLoad}
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
                        infos={lastPartnerSent} 
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
    );
}
