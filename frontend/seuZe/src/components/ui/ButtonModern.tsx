import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleSheet, Text,  TextStyle,  ViewStyle } from "react-native";

type ButtonVariant = "primary" | "outline" | "disabled";
type ButtonSize = "S" | "M" | "L";

interface ComponentsStyles {
    container: ViewStyle,
    text: TextStyle,
    icon: TextStyle,
}

type VariantStyle = Record<ButtonVariant, ComponentsStyles>;
type SizeStyle = Record<ButtonSize, ComponentsStyles>;

export interface ButtonProps extends PressableProps {
    placeholder: string;
    style?: ViewStyle;
    variant?: ButtonVariant;
    size?: ButtonSize; 
    iconName?: keyof typeof Feather.glyphMap;
};

export function ButtonModern({placeholder, variant = "primary", size = "L",style, iconName, ...rest }: ButtonProps) {
    const buttonAnim = useRef(new Animated.Value(1)).current;


    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }

    const sizeStyle: SizeStyle = {
        S: {
            text: styles.textSmall, 
            container: styles.paddingSmall,
            icon: styles.iconSmall,
        },
        M: {
            text: styles.textMedium, 
            container: styles.paddingMedium,
            icon: styles.iconMedium,
        },
        L: {
            text: styles.textLarge, 
            container: styles.paddingLarge,
            icon: styles.iconLarge,
        },
    }

    const variantStyle: VariantStyle = {
        primary: {
            container: styles.primaryContainer, 
            text: styles.textPrimary,
            icon: styles.textPrimary
        },
        outline: {
            container: styles.outlineContainer, 
            text: styles.textOutline,
            icon: styles.textOutline
        },
        disabled: {
            container: styles.disabledContainer, 
            text: styles.textDisabled,
            icon: styles.textDisabled
        }
    }

    const currentStyle = sizeStyle[size];
    const currentVariant = variantStyle[variant];

    return (
        <Animated.View 
            style={[
                styles.baseContainer,
                currentVariant.container, 
                { opacity: buttonAnim }, 
                style
            ]}
        >
            <Pressable 
                {...rest}
                style={[styles.buttonBase, currentStyle.container]}
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
            >   
                {iconName && (
                    <Feather 
                        name={iconName} 
                        style={[
                            currentVariant.icon,
                            currentStyle.icon
                        ]}
                    />
                )}

                <Text 
                    style={[
                        styles.textBase,
                        currentStyle.text,
                        currentVariant.text, 
                    ]}
                >
                    {placeholder}
                </Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    baseContainer: {
        overflow: "hidden",
        borderRadius: theme.radius.sm,
    },

    // estilo botao
    primaryContainer: {
        backgroundColor: theme.colors.orange,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.orange
    },
    disabledContainer: {
        backgroundColor: theme.colors.pseudoLightGray
    },

    // Estilo texto
    textPrimary: {
        color: "white",
    },
    textOutline: {
        color: theme.colors.orange,
    },
    textDisabled: {
        color: theme.colors.darkGray
    },

    // Tamanho botao
    buttonBase: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: theme.gap.xs
    },
    paddingSmall: {
        padding: theme.padding.xs,
    },
    paddingMedium: {
        paddingHorizontal: theme.padding.sm,
        padding: 10,
    },
    paddingLarge: {
        padding: theme.padding.sm,
    },

    // Tamanho texto
    textBase: {
        fontWeight: "bold"
    },
    textSmall: {
        fontSize: theme.typography.textSM.fontSize,
    },
    textMedium: {
        // editar
        fontSize: theme.typography.textMD.fontSize,
    },
    textLarge: {
        fontSize: theme.typography.textLG.fontSize,
    },

    // estilo icone
    iconSmall: {
        fontSize: theme.typography.textMD.fontSize
    },
    iconMedium: {
        fontSize: theme.typography.textMD.fontSize
    },
    iconLarge: {
        fontSize: theme.typography.textXL.fontSize
    }
    
});