import { StyleSheet, View } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "../ui/ButtonModern";
import { TextProductPrice, TextProductPriceSkeleton } from "../ui/TextProductPrice";
import { theme } from "@/src/theme";
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { memo } from "react";


export interface ProductCardSimpleProps {
    name: string,
    qnt: string,
    price: string,
    canBuy: boolean,
    isLoading?: boolean,
}


export function ProductCardSimple({
    name,
    price,
    qnt,
    canBuy = true,
    isLoading = false,
}: ProductCardSimpleProps) {
    const qtdDesc = `Disp: ${qnt}`;

    if(isLoading) 
        return <ProductCardSimpleSkeleton/>

    return (
        <View
            style={styles.container}
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
                />
            </View>
        </View>
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
        // backgroundColor: "red",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: theme.padding.sm,
        // borderWidth: 1,
        // borderColor: "transparent",
        // borderBottomColor: "red",
    },
    desc: {
        // backgroundColor: "blue",
        // flexDirection: "column"
        flex: 1,
    },
    interaction: {
        // backgroundColor: "yellow",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: theme.gap.md,
        // flex: 1,
    }
});