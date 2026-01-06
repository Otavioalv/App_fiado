import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { UserCard } from "@/src/components/common/UserCard";
import { listAllFornecedores } from "@/src/services/clienteService";
import { theme } from "@/src/theme";
import { useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";


export default function Fornecedores() {
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const loadData = async () => {
        setRefreshing(true);
        try{
            console.log("carregado...");
            // const result = await listAllFornecedores();


            // console.log(result);
        }catch(err) {
            console.log(err);
        }finally {
            setRefreshing(false);
        }
    }

    return(
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
            <MyScreenContainer>
                <View 
                    style={{
                        // backgroundColor: "blue", 
                        flex: 1, 
                        width: "100%",
                        gap: 10
                    }}
                >   
                    <UserCard title="Mercearia do joao" description="joao souza, AM"/>
                </View>
            </MyScreenContainer>
        </ScrollView>
    )
}
