import { BasicInfoCardProps } from "@/src/components/common/BasicInfoCard";
import LastActivities from "@/src/components/common/LastActivities";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { QuickShortcuts } from "@/src/components/common/QuickShortcuts";
import { SectionContainer } from "@/src/components/common/SectionContainer";
import { UserHeader } from "@/src/components/common/UserHeader";
import Button from "@/src/components/ui/Button";
import { ButtonQuickRedirectProps } from "@/src/components/ui/ButtonQuickRedirect";
import Loading from "@/src/components/ui/Loading";
import { useSession } from "@/src/context/authContext";
import { me, partnarSent, shoppingList } from "@/src/services/clienteService";
import { theme } from "@/src/theme";
import { DefaultUserDataType, PaginationType, PartnerFornecedorType } from "@/src/types/responseServiceTypes";
import {Feather, FontAwesome} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, ScrollView } from "react-native";


export default function Home() {
    const {session, signOut} = useSession();
    const [userData, setUserData] = useState<DefaultUserDataType>({nome: "", telefone: ""});
    const [isLoading, setIsLoading] = useState<boolean>(false)
    
    const [lastPuschases, setLastPuschases] = useState<BasicInfoCardProps[]>([]);
    const [purchaceLoad, setPurchaceLoad] = useState<boolean>(true);

    const [lastPartnerSent, setLastPartnerSent] = useState<BasicInfoCardProps[]>([]);
    const [lastPartnerLoad, setLastPartnerLoad] = useState<boolean>(true);

    const router = useRouter();
    
    const shortcuts: ButtonQuickRedirectProps[] = [
        {
            title: "Fornecedores", 
            icon: <Feather name="truck" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/fornecedores")

        }, 
        {
            title: "Minhas Parcerias", 
            icon: <FontAwesome name="handshake-o" size={32} color={theme.colors.orange}/>,
            onPress: () => Alert.alert("Teste", "Vai para menu de parcerias, em fornecedores")

        }, 
        {
            title: "Produtos", 
            icon: <Feather name="package" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/produtos")
        }, 
        {
            title: "Minhas Compras", 
            icon: <Feather name="shopping-cart" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/compras")

        }, 
        {
            title: "Notificações", 
            icon: <Feather name="bell" size={32} color={theme.colors.orange}/>,
            onPress: () => Alert.alert("Teste", "Vai para lista de notificações")
        }, 
        {
            title: "Meu Perfil", 
            icon: <Feather name="user" size={32} color={theme.colors.orange}/>,
            onPress: () => router.push("/(cliente)/perfil")
        }  
    ];
    


    const logOut = () => {
        signOut();
    }
    
    const fetchMe = useCallback(async () => {
        setIsLoading(true);
        
        const result:DefaultUserDataType = await me();   

        setUserData(result);
        setIsLoading(false);
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
                const infoData:BasicInfoCardProps[] = result.list.map(r => {
                    const dataObj = new Date(r.coletado_em);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");
                    return {
                        title: r.nome_produto,
                        info: `Coletado em ${day}/${month}`
                    }
                });

                setLastPuschases(infoData);
            }
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
                const infoData:BasicInfoCardProps[] = result.list.map(r => {
                    const dataObj = new Date(r.created_at);
                    const day = String(dataObj.getDate()).padStart(2, "0");
                    const month = String(dataObj.getMonth() + 1).padStart(2, "0");

                    return {
                        title: r.nome,
                        info: `Enviado em ${day}/${month}`
                    }
                });

                setLastPartnerSent(infoData);
            }
        } finally {
            setLastPartnerLoad(false);
        }
    }, []);

    useEffect(() => {
        fetchMe();
        fetchShoppingList();
        fetchPartnerSent();
    }, [fetchMe, fetchShoppingList, fetchPartnerSent]);

    return (
        <ScrollView>
            <Loading visible={isLoading}/>
            <UserHeader nome={userData.nome} apelido={userData.apelido}/>
            <MyScreenContainer>
                <QuickShortcuts shortcuts={shortcuts}/>
                
                <SectionContainer title="Últimas Atividades">
                    <LastActivities title={"Últimas Compras"} infos={lastPuschases} isLoading={purchaceLoad}/>
                </SectionContainer>

                <Button placeholder="teste" onPress={() => Alert.alert("TESTE", `Token: ${session}`)}/>
                <Button placeholder="LogOut" onPress={logOut}/>
            </MyScreenContainer>
        </ScrollView>
    );
}