import { FlatList, FlatListProps, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import { ReactElement, useCallback, useRef, useState } from "react";
import { theme } from "@/src/theme";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";
import MyScreenContainer from "./MyScreenContainer";
import { FlashList, FlashListProps, FlashListRef } from "@shopify/flash-list";
import { ButtonScrollTop } from "../ui/ButtonScrollTop";


export type GenericInfiniteListType<T> = T & {id: string} ;


export interface GenericInfiniteListProps<T> extends FlashListProps<T> {
    data: T[],
    isLoading: boolean,
    isRefetching: boolean;
    isFetchingNextPage?: boolean,
    onRefresh: () => void,
    keyExtractor: (item: T) => string,
    onEndReached?: () => void, 
    renderItem: FlashListProps<T>["renderItem"],
    SkeletonComponent?: ReactElement,
    HeaderComponent?: ReactElement,
    SkeletonList: GenericInfiniteListSkeletonProps<string>,
    emptyMessage?: string,
    hasBorderSeparator?: boolean,
};

export function GenericInfiniteList<T>({
    data,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    onRefresh,
    onEndReached,
    renderItem,
    SkeletonComponent,
    HeaderComponent,
    SkeletonList,
    keyExtractor,
    emptyMessage = "Nenhum item encontrado",
    hasBorderSeparator = false,
}: GenericInfiniteListProps<T>) {
    const [showScrollTopButton, setShowScrollTopButton] = useState<boolean>(false);
    const listRef = useRef<FlashListRef<T>>(null);
    
    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const limit = 2000;
        setShowScrollTopButton(offsetY > limit);
    };

    const scrollToTop = () => {
        listRef.current?.scrollToOffset({ 
            offset: 0, 
            animated: true 
        });
    };

    const renderFooter = useCallback(() => {
        if(!isFetchingNextPage) return null;
        return SkeletonComponent
    },[isFetchingNextPage, SkeletonComponent]);

    const renderEmpty = useCallback(() => (
        <MyScreenContainer>
            <MemoFeedbackTemplate
                title={emptyMessage}
                description={"Verifique os filtros de pesquisa ou sua conexão com a internet."}
                iconName="info"
            />
        </MyScreenContainer>
    ),[emptyMessage]);

    const itemSeparator = () => {
        return (
            <View 
                style={[
                    styles.separator,
                    hasBorderSeparator && styles.borderSeparator
                ]}
            />
        );
    }

    if(isLoading) {
        return (
            <GenericInfiniteListSkeleton 
                data={SkeletonList.data}
                keyExtractor={SkeletonList.keyExtractor}
                renderItem={SkeletonList.renderItem}
                HeaderComponent={SkeletonList.HeaderComponent}
            />
        );
    }

    return (
        <>
            <FlashList
                ref={listRef}
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                onScroll={handleScroll}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.3}
                refreshControl={
                    <RefreshControl
                        tintColor={theme.colors.orange}
                        refreshing={isRefetching}
                        onRefresh={onRefresh}
                        colors={[theme.colors.orange]}
                        progressBackgroundColor={"#FFFFFF"}
                    />
                }
                
                ListHeaderComponent={HeaderComponent}
                ListFooterComponent={renderFooter}
                ListEmptyComponent={renderEmpty}
                ItemSeparatorComponent={itemSeparator}
                contentContainerStyle={styles.contentContainer}
                style={styles.container} // Verificar se faz falta
            />

            {showScrollTopButton && 
                <ButtonScrollTop
                    onPress={scrollToTop}
                />
            }

        </>
    );
}

interface GenericInfiniteListSkeletonProps<T>{
    data: T[],
    renderItem: FlatListProps<T>["renderItem"],
    HeaderComponent?: ReactElement;
    keyExtractor: (item: T) => string;
};

export function GenericInfiniteListSkeleton<T>({
    HeaderComponent,
    renderItem,
    data,
    keyExtractor
}: GenericInfiniteListSkeletonProps<T>) {

    return (
        <FlatList
            data={data}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={HeaderComponent}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1, 
        width: "100%"
    },
    contentContainer: {
        flexGrow: 1,
        gap: theme.gap.sm,
        padding: theme.padding.sm
    },
    separator: {
        height: theme.gap.sm
    },
    borderSeparator: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.pseudoLightGray
    }
});
