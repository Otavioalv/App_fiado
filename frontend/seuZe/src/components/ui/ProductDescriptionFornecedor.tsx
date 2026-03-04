import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { Animated, StyleSheet, Text, View } from "react-native";
import { TextProductPrice, TextProductPriceSkeleton } from "./TextProductPrice";
import { ButtonModern, ButtonModernSkeleton } from "./ButtonModern";

export interface ProductDescriptionFornecedorProps {
    prodName: string,
    price: string | number,
    quantity: number, 
    isLoading?: boolean,
}

export function ProductDescriptionFornecedor({
    prodName,
    price,
    quantity,
    isLoading,
}: ProductDescriptionFornecedorProps) {
    if(isLoading) return <ProductDescriptionFornecedorSkeleton/>;

    return (
        <View style={styles.container}>
            
            <View style={[styles.textContainer, styles.textContainerBase]}>
                <Text style={[styles.titleText, styles.titleBase]} numberOfLines={1}>
                    {prodName}
                </Text>
                <TextProductPrice
                    price={price}
                />
            </View>


            <View style={[styles.textContainerBase]}>
                <Text numberOfLines={1}>
                    {quantity} unidades
                </Text>
            </View>
        </View>
    );
}



export function ProductDescriptionFornecedorSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();
    
    return (
        <View style={styles.container}>
            <View style={styleSkeleton.headContainer}>
                <Animated.View style={[anmOpacity, styleSkeleton.titleTextBase, styleSkeleton.titleText]}/>
                <TextProductPriceSkeleton/>
            </View>

            <View style={styleSkeleton.bottomContainer}>
                <Animated.View style={[anmOpacity, styleSkeleton.textBottom]}/>
                <ButtonModernSkeleton size="M"/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        gap: theme.gap.sm
    },

    textContainerBase: {
        gap: theme.gap.xs
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    

    titleText: {
        fontWeight: "bold",
        fontSize: theme.typography.textLG.fontSize,
    },
    titleBase: {
        color: theme.colors.textNeutral900,
        maxWidth: "70%"
    },
    subTitleText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "500"
    },
    subTitleValueText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,  
    }
});

const styleSkeleton = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bottomContainer: {
        gap: theme.gap.sm
    },
    titleText: {
        width: 180
    }, 
    titleTextBase: {
        borderRadius: 1000,
        height: 30,
    },
    textBottom: {
        borderRadius: 1000,
        height: 15,
        width: 100
    }
});
