import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { Animated, StyleProp, StyleSheet, Text, TextStyle } from "react-native";


interface TextProductPriceProps {
    price: string | number, 
    style?: StyleProp<TextStyle>,
    isLoading?: boolean,
}

export function TextProductPrice({
    price, 
    style,
    isLoading
}: TextProductPriceProps){
    if(isLoading)
        return <TextProductPriceSkeleton/>;

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
        fontSize: theme.typography.textLG.fontSize,
        color: theme.colors.orange,
    },

    textSkeleton: {
        borderRadius: 1000,
        height: 30,
        width: 100,
    },
});