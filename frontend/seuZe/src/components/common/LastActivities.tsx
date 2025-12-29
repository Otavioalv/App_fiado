import { FlatList, Text, View, StyleSheet, Dimensions } from "react-native";
import { BasicInfoCardProps, BasicInfoCardSkeleton, MemoBasicInfoCard} from "./BasicInfoCard";
import { theme } from "@/src/theme";
import {ReactNode, useCallback} from "react";

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
                <MemoBasicInfoCard title={item.title} info={item.info}/>
            </View>
        ),
        []
    );

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
                    contentContainerStyle={styles.listContainer}
                    renderItem={() => (
                        <View style={styles.cardContainer}>
                            <BasicInfoCardSkeleton/>
                        </View>
                    )}
                />
            )}

            
            {isEmpty && emptyStateComponent}

            {!isLoading && !isEmpty && (
                <FlatList
                    data={infos}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={3}
                    windowSize={3}
                    horizontal={true}
                    maxToRenderPerBatch={3}
                    contentContainerStyle={styles.listContainer}
                    renderItem={renderItem}
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