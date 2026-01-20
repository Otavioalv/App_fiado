import { theme } from "@/src/theme";
import { View, Text, TextStyle, ViewStyle, StyleSheet } from "react-native";

type ChipBadgeVariants = "primary" | "outline" | "disabled";

interface ComponentsStyles {
    container: ViewStyle,
    text: TextStyle,
    icon: TextStyle,
}
export interface ChipBadgeProps {
    text: string, 
    variant: ChipBadgeVariants
}

type VariantStyle = Record<ChipBadgeVariants, ComponentsStyles>;


export function ChipBadge({
    text,
    variant
}:ChipBadgeProps) {

    const variantStyle: VariantStyle = {
        primary: {
            container: styles.containerPrimary,
            icon: styles.textPrimary,
            text: styles.textPrimary,
        }, 
        outline: {
            container: styles.containerOutline,
            icon: styles.textOutline,
            text: styles.textOutline,
        },
        disabled: {
            container: styles.containerDisabled,
            icon: styles.textDisabled,
            text: styles.textDisabled,
        }
    }


    const currentVariant = variantStyle[variant];

    return (
        <View
            style={[styles.containerBase, currentVariant.container]}
        >
            <Text
                style={[styles.textBase, currentVariant.text]}
            >
                {text}
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    // Container
    containerBase: {
        padding: theme.padding.xs,
        paddingHorizontal: theme.padding.sm,
        borderRadius: 1000
    },
    containerPrimary: {
        backgroundColor: theme.colors.orange
    },
    containerOutline: {
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: theme.colors.orange
    },
    containerDisabled: {
        backgroundColor: theme.colors.pseudoLightGray
    },

    // Text
    textBase: {
        fontWeight: "bold"
    },
    textPrimary: {
        color: "white"
    },
    textOutline: {
        color: theme.colors.orange
    },
    textDisabled: {
        color: theme.colors.darkGray
    }
});
