import { BottomShoppingCart } from "@/src/components/common/BottomShoppingCart";
import { CartCardProps, MemoCartCard, MemoCartCardSkeleton } from "@/src/components/common/CartCard";
import { GenericInfiniteList, GenericInfiniteListType } from "@/src/components/common/GenericInfiniteList";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { useCartActions, useListShoppingCard, useSaveCart } from "@/src/hooks/useClienteQueries";
import { theme } from "@/src/theme";
import { CartInfoInterface } from "@/src/types/responseServiceTypes";
import { useRouter } from "expo-router";
import { store } from "expo-router/build/global-state/router-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";


export default function ShoppingCart() {
    const router = useRouter();

    const [editableItems, setEditableItems] = useState<CartInfoInterface[]>([])
    const [isDirty, setIsDirty] = useState(false)

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
    
    useEffect(() => {
        if (!dataShopping) return;

        const incoming = dataShopping.pages.flatMap(p => p.list);

        setEditableItems(prev => {
            // cria mapa com o que já foi editado
            const map = new Map<number, typeof prev[number]>();

            prev.forEach(item => {
                map.set(item.id_product, item);
            });

            // adiciona apenas novos itens vindos da API
            incoming.forEach(item => {
                if (!map.has(item.id_product)) {
                    map.set(item.id_product, item);
                }
            });

            return Array.from(map.values());
        });
    }, [dataShopping, dataShopping?.pages.length]); // depende só da quantidade de páginas

    // const {
    //     removeProductFromCart,
    // } = useCartActions();


    function handleChangeQuantity(id: number, newQuantity: number) {
        setEditableItems(prev =>
            prev.map(item =>
                item.id_product === id
                    ? { ...item, quantidade: newQuantity }
                    : item
            )
        );
        setIsDirty(true);
    }

    function handleChangeTerm(id: number, newDate: string) {
        setEditableItems(prev =>
            prev.map(item =>
                item.id_product === id
                    ? { ...item, prazo: newDate }
                    : item
            )
        );

        setIsDirty(true);
    }

    function handleDelete(id: number) {
        setEditableItems(prev =>
            prev.filter(item => item.id_product !== id)
        );

        setIsDirty(true);
    }

    const saveMutation = useSaveCart();

    function handleSave() {
        if (saveMutation.isPending) return;

        saveMutation.mutate(editableItems, {
            onSuccess: () => {
                setIsDirty(false);
            }
        });
    }

    function handleClearAll() {
        if (!editableItems.length) return;

        setEditableItems([]);
        setIsDirty(true);
    }

    // REMOVER ISSO, FAZER ADAPTAÇÃO DAS LISTAS NO BACKEND PRA RETORNAR COM "CURSOR", ISSO E SOMENTE BLINDAGEM PARA N REPETIR DADOS
    // REMOVER ISSO COM USRGENCIA NAS PROXIMAS ATUALIZAÇÕES
    // ISSO FILTRA USUARIOS POR ID PARA NAO CAUSAR REPETIÇÃO DE USUARIO NA LISTA, E NÃO OCORRER UM ERRO
    const listCart = useMemo(() => {
        const map = new Map<string, GenericInfiniteListType<CartCardProps>>();

        editableItems.forEach(item => {
            const idString = item.id_product.toString();

            map.set(idString, {
                id: idString,
                quantity: item.quantidade,
                term: item.prazo,
                price: Number(item.preco) * item.quantidade,
                productName: item.nome_prod,
                store: item.nome_estabelecimento,
                onChangeQuantity: (newQuantity: number) =>
                    handleChangeQuantity(item.id_product, newQuantity),
                onChangeTerm: (newTerm: string) =>
                    handleChangeTerm(item.id_product, newTerm),
                onDelete: () =>
                    handleDelete(item.id_product),
            });
        });

        return Array.from(map.values());
    }, [editableItems]);

    const totalPrice = useMemo(() => {
        return editableItems.reduce((total, item) => {
            return total + (Number(item.preco) * item.quantidade);
        }, 0);
    }, [editableItems]);

    const renderItem = useCallback(
        ({item}: {item: CartCardProps}) => (
            <MemoCartCard
                {...item}
            />
        ),
        []
    );

    const renderItemSkeleton = useCallback(() => (
        // <MemoUserCardSkeleton/>
        <MemoCartCardSkeleton/>
    ), []);

    // console.log(JSON.stringify(dataShopping, null, "  "));

    
    useEffect(() => {
        console.log(editableItems.length);
    }, [editableItems]);

    return (
        <>
            <HeaderBottomContainer>
                <View 
                    style={styles.headerContainer}
                >
                    <ButtonIcon
                        iconName="arrow-left"
                        variant="ghost"
                        onPress={() => router.back()}
                    />
                    <Text style={styles.title}>
                        Carrinho
                    </Text>

                    <ButtonModern
                        placeholder="Limpar tudo"
                        size="S"
                        variant="ghost"
                        onPress={handleClearAll}
                    />
                </View>
            </HeaderBottomContainer>

            <GenericInfiniteList
                SkeletonComponent={<MemoCartCardSkeleton/>}
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
                onRefresh={refetchShopping}
                emptyMessage={"Nenhuma compra encontrada no carrinho"}
            />

            <BottomShoppingCart
                price={totalPrice}
                isLoading={isLoadingShopping}
                isNext={!isDirty}
                disableBtn={saveMutation.isPending || (!editableItems.length && !isDirty)}
                onPressNext={() => router.push("/shopping_resume")}
                onPressSave={handleSave}
                totalItems={ 
                    dataShopping?.pages && dataShopping.pages.length > 0
                        ? dataShopping.pages[dataShopping.pages.length - 1].pagination.total || 0
                        : 0
                }
            />
        </>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "space-between"
    },
    title: {
        ...theme.typography.title
    },
});

