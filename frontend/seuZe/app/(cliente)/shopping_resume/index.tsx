import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { MemoResumeCartCart, MemoResumeCartCartSkeleton, ResumeCartCardProps, ResumeCartCardSkeleton } from "@/src/components/common/ResumeCartCard";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { SpacingScreenContainer } from "@/src/components/ui/SpacingScreenContainer";
import { TextProductPrice } from "@/src/components/ui/TextProductPrice";
import { useBuyProducts, useGetTotalShop, useListShoppingCard } from "@/src/hooks/useClienteQueries";
import { theme } from "@/src/theme";
import { useRouter } from "expo-router";
import { useCallback, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ShoppingResume(){
    const router = useRouter()

    const {
        data: dataShopping,
        isLoading: isLoadingShopping,
        isRefetching: isRefetchingShopping,
        refetch: refetchShopping,
        isFetchingNextPage: isFetchingNextPageShopping,
        hasNextPage: hasNextPageShopping,
        fetchNextPage: fetchNextPageShopping,
    } = useListShoppingCard({
        page: 1,
        size: 20,
    });

    // TotalShopping
    const {
        data: dataTotalShopping,
        isLoading: isLoadingTotalShopping,
        refetch: refetchTotalShopping,
    } = useGetTotalShop();

    const {
        mutate: buyProducts, 
        isPending: pendingBuyProducts 
    } = useBuyProducts({
        onSuccess: () => {
            router.push("/shopping_resume/success");
        }
    });

    const listCart = useMemo(() => {
        if(!dataShopping) return [];
        const map = new Map<string, GenericInfiniteListType<ResumeCartCardProps>>();

        dataShopping.pages.forEach(page => {
            page.list.forEach(u => {
                const idString = u.id_product.toString();

                map.set(idString, {
                    id: idString,
                    nomeEstabelecimento: u.nome_estabelecimento,
                    price: Number(u.preco),
                    prodName: u.nome_prod,
                    quanity: u.quantidade,
                    term: u.prazo,
                });
            });
        });

        return Array.from(map.values());

    }, [dataShopping]);

    const renderItem = useCallback(
        ({item}: {item: ResumeCartCardProps}) => (
            <MemoResumeCartCart
                {...item}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
        // <MemoUserCardSkeleton/>
        <MemoResumeCartCartSkeleton/>
    ), []);

    return (
        <>
            <HeaderBottomContainer style={styles.headerContainer}>
                 <ButtonIcon
                    iconName="arrow-left"
                    variant="ghost"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>
                    Resumo do Pedido
                </Text>
            </HeaderBottomContainer>

            <GenericInfiniteList
                SkeletonComponent={<ResumeCartCardSkeleton/>}
                SkeletonList={{
                    data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                    keyExtractor: (i) => i,
                    renderItem: renderItemSkeleton,
                }}
                data={listCart}
                renderItem={renderItem}
                isFetchingNextPage={isFetchingNextPageShopping}
                isLoading={isLoadingShopping}
                isRefetching={isRefetchingShopping}
                keyExtractor={(i) => i.id.toString()}
                onEndReached={() => {
                    if (hasNextPageShopping && !isFetchingNextPageShopping) {
                        fetchNextPageShopping();
                    }
                }}
                onRefresh={() => {refetchShopping(); refetchTotalShopping();}}
                emptyMessage={"Nenhuma não encontrada no carrinho"}
            />

            <SpacingScreenContainer style={styles.container}>
                <View style={styles.infoTop}>
                    <View style={styles.infoBetwen}>
                        <Text style={styles.textTotalInfo}>
                            TOTAL DO PEDIDO
                        </Text>
    
                        <TextProductPrice
                            price={Number(dataTotalShopping)}
                            size="L"
                        />
                    </View> 
                </View>
    
                <ButtonModern
                    // placeholder="Proximo Passo"
                    placeholder={"Finalizar Pedido"}
                    iconName={"shopping-cart"}
                    size="L"
                    variant={!pendingBuyProducts?"primary":"disabled"}
                    onPress={() => buyProducts()}
                    disabled={pendingBuyProducts}
                />
            </SpacingScreenContainer>
        </>
    )
}


const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center",
    },
    title: {
        ...theme.typography.title
    },
    infoTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    container: {
        gap: theme.gap.sm,
        borderTopColor: theme.colors.pseudoLightGray,
        borderTopWidth: 1,
    },
    textTotalInfo: {
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.textNeutral900,
    },
    infoBetwen: {
        gap: theme.gap.xs
    },
});
