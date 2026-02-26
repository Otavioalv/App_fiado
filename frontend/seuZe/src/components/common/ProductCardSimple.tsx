import { Pressable, StyleSheet, View, PressableProps } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "../ui/ButtonModern";
import { TextProductPrice, TextProductPriceSkeleton } from "../ui/TextProductPrice";
import { theme } from "@/src/theme";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { memo } from "react";


export interface ProductCardSimpleProps extends PressableProps{
    name: string,
    qnt: string,
    price: string,
    canBuy: boolean,
    isLoading?: boolean,
    onPressAddProduct?: () => void
}


export function ProductCardSimple({
    name,
    price,
    qnt,
    canBuy = true,
    isLoading = false,
    onPressAddProduct,
    ...pressableProps
}: ProductCardSimpleProps) {
    const qtdDesc = `Estoque: ${qnt} un`;

    if(isLoading) 
        return <ProductCardSimpleSkeleton/>

    return (
        <Pressable
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressedContainer
            ]}
            {...pressableProps}
        >
            <DefaultDescription
                text1={name}
                text2={qtdDesc}
                size="S"
            />

            <View
                style={styles.interaction}
            >
                <TextProductPrice
                    price={price}
                />

                <ButtonModern
                    style={{borderRadius: 1000, paddingHorizontal: 10}}
                    placeholder="Adicionar"
                    variant={canBuy ? "outline" : "disabled"}
                    size="S"
                    onPress={onPressAddProduct}
                />
            </View>
        </Pressable>
    );
}
export const MemoProductCardSimple = memo(ProductCardSimple);


export function ProductCardSimpleSkeleton() {
    return (
        <View style={styles.container}>
            <DefaultDescriptionSkeleton size="M"/>

            <View style={styles.interaction}>
                <TextProductPriceSkeleton/>
                <ButtonModernSkeleton size="S" style={{width: 80}}/>
            </View>
        </View>
    );
}
export const MemoProductCardSimpleSkeleton = memo(ProductCardSimpleSkeleton);



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: theme.padding.md,
    },
    desc: {
        flex: 1,
    },
    interaction: {
        // backgroundColor: "yellow",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.gap.md,
    },
    pressedContainer: {
        backgroundColor: theme.colors.orange + "11",
    }
});