import { ReactElement, useCallback, useRef, useState } from "react";
import { MemoProductCard, ProductCardProps } from "./ProductCard";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import { theme } from "@/src/theme";
import { MemoUserCardSkeleton } from "./UserCard";
import MyScreenContainer from "./MyScreenContainer";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";


export type ListProductsType = ProductCardProps & {id: string}

export interface ListProductsProps {
    data: ListProductsType[],
    onRefresh: () => void,
    refreshing: boolean,
    isFetchingNextPage: boolean,
    onEndReached: () => void, 
    headerComponent?: ReactElement;
}

export function ListProducts({
    data,
    isFetchingNextPage, 
    onEndReached,
    onRefresh,
    refreshing,
    headerComponent
}: ListProductsProps) {
    const [showScrollTopButton, setShowScrollTopButton] = useState<boolean>(false);
    const listRef = useRef<FlashListRef<ListProductsType>>(null);
    // console.log(JSON.stringify(data, null, "  "));

    const renderItem = useCallback(
        ({item}: {item: ProductCardProps}) => (
            <MemoProductCard
                fornecedorName={item.fornecedorName}
                marketName={item.marketName}
                price={item.price}
                prodName={item.prodName}
                relationshipType={item.relationshipType}
            />
        ),
        []
    );

    // MemoListProductCard
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

        if (offsetY > limit && !showScrollTopButton) {
            setShowScrollTopButton(true);
        } else if (offsetY <= limit && showScrollTopButton) {
            setShowScrollTopButton(false);
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
        </>
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
        padding: theme.padding.sm
    },

});
