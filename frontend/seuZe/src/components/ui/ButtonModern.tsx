import { theme } from "@/src/theme";
import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleSheet, Text, ViewStyle } from "react-native";


type ButtonVariant = "primary" | "outline";

export type ButtonProps = PressableProps & {
    placeholder: string,
    style?: ViewStyle,
    variant?: ButtonVariant,
};

export default function ButtonModern({ placeholder, variant = "primary", style, ...rest }: ButtonProps) {
    const buttonAnim = useRef(new Animated.Value(1)).current;
    const isPrimary = variant === 'primary';

    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }


    return (
        <Animated.View 
            style={[
                isPrimary ? styles.primaryContainer : styles.outlineContainer, 
                {opacity: buttonAnim}, 
                styles.baseContainer,
                style
            ]}
        >
            <Pressable 
                {...rest}
                style={styles.button}
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
            >
                <Text 
                    style={[isPrimary ? styles.textPrimary : styles.textOutline, styles.textBase]}
                >
                    {placeholder}
                </Text>
            </Pressable>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    button: {
        alignItems: "center",
        padding: theme.padding.sm,
    },
    baseContainer: {
        overflow: "hidden",
        borderRadius: theme.radius.sm,
        // flex: 1
    },
    primaryContainer: {
        backgroundColor: theme.colors.orange,
    },
    outlineContainer: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.orange
    },
    textBase: {
        ...theme.typography.textLG,
        fontWeight: "bold"
    },
    textPrimary: {
        color: "white",
    },
    textOutline: {
        color: theme.colors.orange,
    }
});
