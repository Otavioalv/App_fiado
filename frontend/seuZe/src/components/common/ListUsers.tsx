import { FlatList, RefreshControl, StyleSheet, View } from "react-native";
import { MemoUserCard, UserCardProps } from "./UserCard";
import { useCallback } from "react";
import { theme } from "@/src/theme";


export type ListUsersType = UserCardProps & {id: string};

export interface ListUsersProps {
    data: ListUsersType[],
    onRefresh: () => void,
    refreshing: boolean,
    onEndReached: () => void, 
}

export function ListUsers({data, onRefresh, refreshing, onEndReached}: ListUsersProps) {
    
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

            /* 
                ListFooterComponent={renderFooter}
                
                // Mostra o spinner lá embaixo
                ListFooterComponent={renderFooter}
            */
        />
    );
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
