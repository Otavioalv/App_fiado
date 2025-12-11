import { theme } from "@/src/theme";
import { useRef } from "react";
import { Animated, Pressable, PressableProps, StyleSheet, Text } from "react-native";

export type ButtonProps = PressableProps & {
    placeholder: string
}

export default function Button({ placeholder, ...rest }: ButtonProps) {
    const buttonAnim = useRef(new Animated.Value(1)).current;

    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }

    return (
        <Animated.View style={[style.buttonContainer, {opacity: buttonAnim}]}>
            <Pressable 
                {...rest}
                style={style.button}
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
            >
                <Text 
                    style={style.text}
                >
                    {placeholder}
                </Text>
            </Pressable>
        </Animated.View>
    )
}

const style = StyleSheet.create({
    buttonContainer: {   
        backgroundColor: theme.colors.bgBttDefault,
        borderRadius: theme.radius.sm,
        overflow: "hidden"
    },
    button: {
        alignItems: "center",
        padding: theme.padding.sm,
    },
    text: {
        color: theme.colors.orange,
        ...theme.typography.title
    }
});
