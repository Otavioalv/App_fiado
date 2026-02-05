import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { AppDefaultSizes } from "@/src/types/responseServiceTypes";
import { Animated, StyleProp, StyleSheet, Text, TextStyle } from "react-native";

type ComponentsStyles = {
    text: TextStyle
}

type SizeStyleType = Record<AppDefaultSizes, ComponentsStyles>;

interface TextProductPriceProps {
    price: string | number, 
    size?: AppDefaultSizes,
    style?: StyleProp<TextStyle>,
    isLoading?: boolean,
}

export function TextProductPrice({
    price, 
    style,
    isLoading,
    size = 'M',
}: TextProductPriceProps){
    if(isLoading)
        return <TextProductPriceSkeleton/>;


    const sizeStyle: SizeStyleType = {
        S: {
            text: styles.text
        }, 
        M: {
            text: styles.textMedium
        },
        L: {
            text: styles.textLarge
        }
    }

    const currentStyle = sizeStyle[size];


    // Separar isso, posso reutilizar
    const formatCurrency = (value: string | number) => {
        const numericValue = typeof value === 'string' ? Number(value) : value;

        if (isNaN(numericValue)) return "R$ 0,00";

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(numericValue);
    }

    const formatedPrice = formatCurrency(price);

    return (
        <Text 
            style={[
                styles.text,
                currentStyle.text,
                style
            ]} 
            numberOfLines={1}
        >
            {formatedPrice}
        </Text>
    );
}


export function TextProductPriceSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <Animated.View style={[anmOpacity, styles.textSkeleton]}/>
    );
}   

const styles = StyleSheet.create({
    text: {
        fontWeight: "bold",
        color: theme.colors.orange,
    },
    textSmall: {

    },
    textMedium: {
        fontSize: theme.typography.textLG.fontSize,
    },
    textLarge: {
        fontSize: theme.typography.text2XL.fontSize,
        fontWeight: "900"
    },
    textSkeleton: {
        borderRadius: 1000,
        height: 30,
        width: 100,
    },
});