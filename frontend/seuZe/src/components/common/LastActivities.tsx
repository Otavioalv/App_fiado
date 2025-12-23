import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import { SectionContainer } from "./SectionContainer";
import { BasicInfoCardProps,  BasicInfoCard, BasicInfoCardSkeleton} from "./BasicInfoCard";
import { theme } from "@/src/theme";
import { useCallback, useEffect, useState } from "react";
import { shoppingList } from "@/src/services/clienteService";
import { PaginationType } from "@/src/types/responseServiceTypes";
import NoPurchases from "./NoPurchases";


export type LastActivitiesProps = {
    title: string,
    infos: BasicInfoCardProps[],
    isLoading: boolean
}

export default function LastActivities({title, infos, isLoading}: LastActivitiesProps) {
    // const [infos, setInfos] = useState<BasicInfoCardProps[]>([]);
    // const [isLoading, setIsLoaging] = useState<boolean>(true);
    

    // Remover callback
    // const fetchShoppingList = useCallback(async () => {
    //     try {
    //         setIsLoaging(true);

    //         const pagination: PaginationType = {
    //             page: 1,
    //             size: 10, 
    //             filter: "Mais Recente"
    //         }

    //         // chama a api
    //         const result = await shoppingList(pagination);
            
    //         if(result.length){
    //             const infoData:BasicInfoCardProps[] = result.map(r => {
    //                 const dataObj = new Date(r.coletado_em);
    //                 const day = String(dataObj.getDate()).padStart(2, "0");
    //                 const month = String(dataObj.getMonth() + 1).padStart(2, "0");
    //                 return {
    //                     title: r.nome_produto,
    //                     info: `Coletado em ${day}/${month}`
    //                 }
    //             });

    //             setInfos(infoData);
    //         }
    //     }finally {
    //         setIsLoaging(false);
    //     }
    // }, []);

    // useEffect(() => {
    //     fetchShoppingList()
    // }, [fetchShoppingList]);

    return (
        <View>
            <Text style={styles.textSubtitle}>
                {title}
            </Text>
            
            {isLoading ? (
                <FlatList
                    data={[1, 2]}
                    keyExtractor={(_, index) => index.toString()}
                    horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    renderItem={() => (
                        <View style={styles.cardContainer}>
                            <BasicInfoCardSkeleton/>
                        </View>
                    )}
                />
            ) : infos.length ? (
                <FlatList
                    data={infos}
                    keyExtractor={(_, index) => index.toString()}
                    initialNumToRender={3}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({item}) => (
                        <View style={styles.cardContainer}>
                            <BasicInfoCard title={item.title} info={item.info}/>
                        </View>
                    )}
                />
            ) : (
                <NoPurchases/>
            )}
        </View>
    );
}



const screenWidth = Dimensions.get("window").width;
const cardMinWidth = screenWidth * 0.50;
const cardMaxWidth = screenWidth * 0.80;

const styles = StyleSheet.create({
    listContainer: {
        padding: theme.padding.sm,
        gap: theme.gap.md,
        // backgroundColor: "red"
    },
    cardContainer: {
        minWidth: cardMinWidth,
        maxWidth: cardMaxWidth
    },
    textSubtitle: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "600",
        color: theme.colors.textNeutral900
    }
});