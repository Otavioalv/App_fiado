import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import { BasicInfoCardProps, BasicInfoCardSkeleton, MemoBasicInfoCard} from "./BasicInfoCard";
import { theme } from "@/src/theme";
import {ReactNode, useCallback} from "react";
import { FlashList } from "@shopify/flash-list";

export type InfoType = BasicInfoCardProps & {id: string};

export interface LastActivitiesProps {
    title: string;
    infos: InfoType[];
    isLoading: boolean;
    emptyStateComponent?: ReactNode;
}

export default function LastActivities({title, infos, isLoading, emptyStateComponent}: LastActivitiesProps) {
    const isEmpty = !isLoading && infos.length === 0;

    const renderItem = useCallback(
        ({item}: {item: InfoType}) => (
            <View style={styles.cardContainer}>
                
                <MemoBasicInfoCard 
                    title={item.title} 
                    info={item.info}
                />
                
            </View>
        ),
        []
    );

    const itemSeparator = () => {
        return (
            <View style={{width: theme.gap.sm}}/>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.textSubtitle}>
                {title}
            </Text>

            {isLoading && (
                <FlatList
                    data={["1", "2"]}
                    keyExtractor={(item) => item}
                    horizontal={true}
                    contentContainerStyle={[styles.listContainer, styles.listContainerSkeleton]}
                    showsHorizontalScrollIndicator={false}
                    renderItem={() => (
                        <View style={styles.cardContainer}>
                            <BasicInfoCardSkeleton/>
                        </View>
                    )}
                />
            )}

            
            {isEmpty && emptyStateComponent}

            {!isLoading && !isEmpty && (
                <FlashList
                    data={infos}
                    keyExtractor={(item) => item.id}
                    // initialNumToRender={5}
                    // windowSize={10}
                    // maxToRenderPerBatch={10}
                    horizontal={true}
                    contentContainerStyle={styles.listContainer}
                    showsHorizontalScrollIndicator={false}
                    renderItem={renderItem}
                    ItemSeparatorComponent={itemSeparator}
                />
            )}
        </View>
    );
}



const screenWidth = Dimensions.get("window").width;
const cardMinWidth = screenWidth * 0.50;
const cardMaxWidth = screenWidth * 0.80;

const styles = StyleSheet.create({
    container: {
        gap: theme.gap.sm
    },
    listContainer: {
        padding: theme.padding.sm,
        paddingHorizontal: 0,
    },
    listContainerSkeleton: {
        gap: theme.gap.sm,
        // backgroundColor: "red"
    },
    cardContainer: {
        minWidth: cardMinWidth,
        maxWidth: cardMaxWidth
    },
    textSubtitle: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "400",
        
        color: theme.colors.textNeutral900
    }
});
