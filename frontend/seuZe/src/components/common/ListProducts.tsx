import { ReactElement, useCallback, useRef, useState } from "react";
import { MemoProductCard, MemoProductCardSkeleton, ProductCardProps } from "./ProductCard";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import { theme } from "@/src/theme";
import MyScreenContainer from "./MyScreenContainer";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";
import { ButtonScrollTop } from "../ui/ButtonScrollTop";


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
                nome={item.nome}
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
                <MemoProductCardSkeleton/>
            );
        },
        [isFetchingNextPage]
    );

    const renderEmpty = useCallback(
        () => (
            <MyScreenContainer>
                <MemoFeedbackTemplate
                    title={"Nenhum produto encontrado"}
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



type ListProductsSkeletonProps = {headerComponent?: ReactElement};

export function ListProductsSkeleton({headerComponent}: ListProductsSkeletonProps) {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


    const renderItem = useCallback(() => (
        <View>
            <MemoProductCardSkeleton/>
        </View>
    ), []);

    return (
        <FlatList
            data={data}
            keyExtractor={(item) => item.toString()}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            renderItem={renderItem}
            ListHeaderComponent={headerComponent}
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
    },

});
