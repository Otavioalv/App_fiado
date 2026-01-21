import { ReactElement, useCallback, useRef, useState } from "react";
import { MemoShoppingCard, MemoShoppingCardSkeleton, ShoppingCardProps, ShoppingCardSkeleton } from "./ShoppingCard";
import { FlashList, FlashListRef } from "@shopify/flash-list";
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, RefreshControl, StyleSheet, View } from "react-native";
import { theme } from "@/src/theme";
import MyScreenContainer from "./MyScreenContainer";
import { MemoFeedbackTemplate } from "./FeedbackTemplate";
import { ButtonScrollTop } from "../ui/ButtonScrollTop";


export type ListShoppingType = ShoppingCardProps & {id: string}

export interface ListShoppingProdProps {
    data: ListShoppingType[],
    onRefresh: () => void,
    refreshing: boolean,
    isFetchingNextPage: boolean,
    onEndReached: () => void, 
    headerComponent?: ReactElement;
}


export function ListShoppingProd({
    data, 
    onRefresh, 
    refreshing, 
    onEndReached, 
    isFetchingNextPage,
    headerComponent
}: ListShoppingProdProps) {
    const listRef = useRef<FlashListRef<ListShoppingType>>(null);
    const [showScrollTopButton, setShowScrollTopButton] = useState<boolean>(false);

    const renderItem = useCallback(
        ({item}: {item: ShoppingCardProps}) => (
            <MemoShoppingCard
                marketName={item.marketName}
                nome={item.nome}
                price={item.price}
                prodName={item.prodName}
                status={item.status}
                apelido={item.apelido}
                prazo={item.prazo}
                paid={item.paid}
                criadoEm={item.criadoEm}
            />
        ),
        []
    );

    const renderFooter = useCallback(
        () => {
            if(!isFetchingNextPage) return null;
            return (
                <ShoppingCardSkeleton/>
            );
        }, 
        [isFetchingNextPage]
    );

    const renderEmpty = useCallback(
        () => (
            <MyScreenContainer>
                <MemoFeedbackTemplate
                    title={"Nenhuma compra encontrada"}
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

type ListShoppingProdSkeletonProps = {headerComponent?: ReactElement};

export function ListShoppingProdSkeleton({headerComponent}: ListShoppingProdSkeletonProps) {
    const data = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    const renderItem = useCallback(() => (
        <View>
            <MemoShoppingCardSkeleton/>
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
    }
});