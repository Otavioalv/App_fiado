import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { MemoUserCard, MemoUserCardSkeleton, UserCardProps } from "./UserCard";
import { useCallback } from "react";
import { theme } from "@/src/theme";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";
import MyScreenContainer from "./MyScreenContainer";


export type ListUsersType = UserCardProps & {id: string};

export interface ListUsersProps {
    data: ListUsersType[],
    onRefresh: () => void,
    refreshing: boolean,
    isFetchingNextPage: boolean,
    onEndReached: () => void, 
}

export function ListUsers({data, onRefresh, refreshing, onEndReached, isFetchingNextPage}: ListUsersProps) {
    
    const renderItem = useCallback(
        ({item}: {item: UserCardProps}) => (
            <MemoUserCard 
                title={item.title} 
                description={item.description} 
                relationshipType={item.relationshipType}
            />
        ),
        []
    );

    const renderFooter = useCallback(
        () => {
            if(!isFetchingNextPage) return null;
            return (
                <MemoUserCardSkeleton/>
            );
        },
        [isFetchingNextPage]
    );

    const renderEmpty = useCallback(
        () => (
            <MyScreenContainer>
                <MemoFeedbackTemplate
                    title={"Nenhum fornecedor encontrado"}
                    description={"Verifique a escrita ou sua conexão com a internet."}
                    iconName="info"
                />
            </MyScreenContainer>
        ),
        []
    );

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.id}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={10}
            removeClippedSubviews={true}  // testar
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
            refreshControl={
                <RefreshControl
                    tintColor={theme.colors.orange}
                    colors={[theme.colors.orange]}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    progressBackgroundColor={"#FFFFFF"}
                />
            }
            
            onEndReached={onEndReached}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={renderEmpty}
        />
    );
}

export function ListUsersSkeleton() {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


    const renderItem = useCallback(() => (
        <View>
            <MemoUserCardSkeleton/>
        </View>
    ), []);

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.toString()}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: "100%",
    },
    contentContainer: {
        flexGrow: 1,
        gap: theme.gap.sm,
        padding: theme.padding.sm
    }
});
