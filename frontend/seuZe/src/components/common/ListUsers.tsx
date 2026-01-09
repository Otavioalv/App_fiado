import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { MemoUserCard, MemoUserCardSkeleton, UserCardProps } from "./UserCard";
import { useCallback } from "react";
import { theme } from "@/src/theme";


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
            <View>
                <MemoUserCard 
                    title={item.title} 
                    description={item.description} 
                    relationshipType={item.relationshipType}
                />
            </View>
        ),
        []
    );

    const renderFooter = useCallback(
        () => {
            if(!isFetchingNextPage) return null;
            return (
                <View>
                    <MemoUserCardSkeleton/>
                </View>
            );
        },
        [isFetchingNextPage]
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
        padding: theme.padding.md
    }
});
