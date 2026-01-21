import { FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import { MemoUserCard, MemoUserCardSkeleton, UserCardProps } from "./UserCard";
import { ReactElement, useCallback, useRef, useState } from "react";
import { theme } from "@/src/theme";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";
import MyScreenContainer from "./MyScreenContainer";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { ButtonScrollTop } from "../ui/ButtonScrollTop";


export type ListUsersType = UserCardProps & {id: string};

export interface ListUsersProps {
    data: ListUsersType[],
    onRefresh: () => void,
    refreshing: boolean,
    isFetchingNextPage: boolean,
    onEndReached: () => void, 
    headerComponent?: ReactElement;
}

export function ListUsers({
    data, 
    onRefresh, 
    refreshing, 
    onEndReached, 
    isFetchingNextPage,
    headerComponent
}: ListUsersProps) {
    const [showScrollTopButton, setShowScrollTopButton] = useState<boolean>(false);
    const listRef = useRef<FlashListRef<ListUsersType>>(null);

    const renderItem = useCallback(
        ({item}: {item: UserCardProps}) => (
            <MemoUserCard 
                title={item.title} 
                description={item.description} 
                relationshipType={item.relationshipType}
                date={item.date}
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
                    description={"Verifique os filtros de pesquisa ou sua conexão com a internet."}
                    iconName="info"
                />
            </MyScreenContainer>
        ),
        []
    );

    const itemSeparator = () => {
        return (
            <View style={{height: theme.gap.sm}}/>
        );
    }

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const limit = 2000;

        // console.log(offsetY);

        if (offsetY > limit && !showScrollTopButton) {
            setShowScrollTopButton(true);
        } else if (offsetY <= limit && showScrollTopButton) {
            setShowScrollTopButton(false);
        }
    };

    const scrollToTop = () => {
        if(listRef.current) {
            listRef.current.scrollToOffset({ 
                offset: 0, 
                animated: true 
            });
        }
    };


    return (
        <>
            <FlashList
                ref={listRef}
                data={data}
                keyExtractor={(item) => item.id}
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
                ListHeaderComponent={headerComponent}
                onScroll={handleScroll}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                ItemSeparatorComponent={itemSeparator}

            />

            {showScrollTopButton && 
                <ButtonScrollTop
                    onPress={scrollToTop}
                />
            }

        </>
    );
}

type ListUsersSkeletonProps = {headerComponent?: ReactElement};

export function ListUsersSkeleton({headerComponent}: ListUsersSkeletonProps) {
    const data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


    const renderItem = useCallback(() => (
        <View>
            <MemoUserCardSkeleton/>
        </View>
    ), []);

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
            ListHeaderComponent={headerComponent}
            // ListHeaderComponentStyle={{backgroundColor: "red"}}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: "100%",
        // height: "100%",
        // gap: theme.gap.xs
    },
    contentContainer: {
        flexGrow: 1,
        gap: theme.gap.sm,
        padding: theme.padding.sm
    }
});
