import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Animated, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";


type StepperVariantType = "primary" | "disabled";

interface ComponentsStyles {
    container: ViewStyle,
    text: TextStyle,
    
    minusButton: ViewStyle,
    plusButton: ViewStyle,
    plusIcon: TextStyle,
    minusIcon: TextStyle,
};

type VariantStyleType = Record<StepperVariantType, ComponentsStyles>;
interface StepperProps {
    quantity: number,
    setQuantity: Dispatch<SetStateAction<number>>,
    variant?: StepperVariantType,
    isLoading?: boolean,
    isInteractive?: boolean, 
};



export function Stepper({
    quantity,
    setQuantity,
    variant = "primary",
    isLoading = false,
    isInteractive = true,
}: StepperProps) {
    if(isLoading) 
        return <StepperSkeleton/>

    const handlePlusQnt = () => {
        setQuantity(quantity+1);
    }

    const handleMinusQnt = () => {
        if(quantity > 1) {
            setQuantity(quantity-1);
        }
    }


    const variantStyle: VariantStyleType = {
        primary: {
            container: styles.containerPrimary,
            minusButton: styles.buttonMinusPrimary,
            plusButton: styles.buttonPlusPrimary,
            text: styles.countPrimary,
            minusIcon: styles.iconMinusPrimary,
            plusIcon: styles.iconPlusPrimary,
        },
        disabled: {
            container: styles.containerDisabled,
            minusButton: styles.buttonMinusDisabled,
            plusButton: styles.buttonPlusDisabled,
            text: styles.countDisabled,
            minusIcon: styles.iconMinusDisabled,
            plusIcon: styles.iconPlusDisabled,
        }
    }

    const currentVariant = variantStyle[variant];
    
    return (
        <View
            style={[
                styles.container,
                currentVariant.container
            ]}
        >
            <Pressable
                disabled={!isInteractive}
                onPress={handleMinusQnt}
                style={({pressed}) => [
                    styles.button,
                    styles.buttonMinus,
                    currentVariant.minusButton,
                    pressed && {opacity: 0.7}
                ]}
            >
                <Feather 
                    name="minus"
                    style={[
                        styles.icon,
                        styles.iconMinus,
                        currentVariant.minusIcon
                    ]}
                />
            </Pressable>
            <Text
                style={[
                    styles.count,
                    currentVariant.text,
                ]}
            >
                {quantity}
            </Text>
            <Pressable
                disabled={!isInteractive}
                onPress={handlePlusQnt}
                style={({pressed}) => [
                    styles.button,
                    styles.buttonPlus,
                    currentVariant.plusButton,
                    pressed && {opacity: 0.7}
                ]}
            >
                <Feather 
                    name="plus" 
                    style={[
                        styles.icon,    
                        styles.iconPlus,
                        currentVariant.plusIcon,
                    ]}
                />
            </Pressable>
        </View>
    );
}


export function StepperSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();


    return (
        <Animated.View
            style={[
                styles.container
            ]}
        >
            <Animated.View
                style={[
                    anmOpacity,
                    styles.buttonSkeleton
                ]}
            />
            <Animated.View
                style={[
                    anmOpacity,
                    styles.countSkeleton,
                ]}
            />
            <Animated.View
                style={[
                    anmOpacity,
                    styles.buttonSkeleton,
                ]}
            />
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    // Container
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.gap.xs
        // backgroundColor: "blue"
    },
    containerPrimary: {

    },
    containerDisabled: {

    },

    // Count
    count: {
        fontSize: theme.typography.textSM.fontSize
    },
    countPrimary: {
        color: theme.colors.textNeutral900,
    },
    countDisabled: {
        color: theme.colors.darkGray,
    },
    countSkeleton: {
        borderRadius: theme.radius.xs,
        width: 10, 
        height: 20,
    },
    
    // Button
    button: {
        padding: 10,
        paddingHorizontal: theme.padding.sm,
        borderRadius: theme.radius.sm,
    },
    
    buttonPlus: {
        
    },
    buttonPlusPrimary: {
        backgroundColor: theme.colors.orange,
    },
    buttonPlusDisabled: {
        backgroundColor: theme.colors.pseudoLightGray,
    },      
    
    buttonMinus: {
        // backgroundColor: theme.colors.pseudoLightGray,
    },
    buttonMinusPrimary: {
        backgroundColor: theme.colors.pseudoLightGray,
    },
    buttonMinusDisabled: {
        backgroundColor: theme.colors.pseudoLightGray,
    },

    buttonSkeleton: {
        borderRadius: theme.radius.sm,
        width: 44, 
        height: 36,
    },

    // Icon
    icon:{
        fontSize: theme.typography.textSM.fontSize
    },
    
    iconPlus: {
        
    },
    iconPlusPrimary: {
        color: "white",
    },
    iconPlusDisabled: {
        color: theme.colors.darkGray
    },

    iconMinus: {
        // color: theme.colors.darkGray
    },
    iconMinusPrimary: {
        color: theme.colors.darkGray
    },
    iconMinusDisabled: {
        color: theme.colors.darkGray
    },
    
}); 
