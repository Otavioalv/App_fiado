import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";

type ButtonVariant = "primary" | "outline" | "ghost";
// type ButtonVariant = "primary" | "outline" | "disabled" | "ghost";

interface ComponentsStyles {
    container: ViewStyle,
    icon: TextStyle,
}

type VariantStyle = Record<ButtonVariant, ComponentsStyles>;


interface ButtonIconProps extends PressableProps {
    iconName: keyof typeof Feather.glyphMap,
    variant?: ButtonVariant,
    cardStyle?: StyleProp<ViewStyle>,
};


export function ButtonIcon({
    iconName, 
    variant = "primary",
    cardStyle,
    ...pressableProps
}: ButtonIconProps) {
    const buttonAnim = useRef(new Animated.Value(1)).current;
    
    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }


    const variantStyle: VariantStyle = {
        primary: {
            container: styles.containerPrimary,
            icon: styles.iconPrimary,
        },
        outline: {
            container: styles.containerOutline,
            icon: styles.iconOutline,
        },
        ghost: {
            container: styles.containerGhost,
            icon: styles.iconGhost,
        }
    }


    const currentVariant = variantStyle[variant];

    return (
        <Animated.View
            style={[
                styles.containerBase,
                currentVariant.container,
                {opacity: buttonAnim},
                cardStyle
            ]}
        >
            <Pressable
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
                {...pressableProps}
            >
                <Feather
                    name={iconName}
                    style={[
                        styles.iconBase,
                        currentVariant.icon
                    ]}
                />
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    // Container
    containerBase: {
        width: 45,
        height: 45,
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center'
    },
    containerPrimary: {
        backgroundColor: theme.colors.orange,
    },  
    containerOutline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.orange
    },
    containerGhost: {
        backgroundColor: "transparent"
    },


    // Texto
    iconBase: {
        fontSize: theme.typography.textLG.fontSize
    },
    iconPrimary: {
        color: "white",
        
    },
    iconOutline: {
        color: theme.colors.orange,
    },
    iconGhost: {
        color: theme.colors.orange,
    }
});
