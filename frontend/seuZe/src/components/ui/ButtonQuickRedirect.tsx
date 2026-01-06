import { theme } from "@/src/theme";
import { ReactNode, useRef, memo } from "react";
import { Animated, Pressable, PressableProps, StyleSheet, Text, View } from "react-native";


export type ButtonQuickRedirectProps = PressableProps & {
    title: string,
    icon?: ReactNode
}

export function ButtonQuickRedirect({title, icon, ...rest}: ButtonQuickRedirectProps) {
    const buttonAnim = useRef(new Animated.Value(0)).current;

    const backGroundColorBtt = buttonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["transparent", theme.colors.orangeOpacity]
    })

    const animationBtt = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: false
        }).start();
    }

    return (
        <Pressable 
            style={styles.button}
            onPressIn={() => animationBtt(1)}
            onPressOut={() => animationBtt(0)}
            {...rest}
        >
            <Animated.View style={[styles.container, {backgroundColor: backGroundColorBtt}]}>
                {icon && (
                    <View style={styles.iconContainer}>
                        {icon}
                    </View>
                )}

                <Text style={styles.titleText}>
                    {title}
                </Text> 

            </Animated.View>
        </Pressable>
    );
}

export const MemoButtonQuickRedirect = memo(ButtonQuickRedirect);

const styles = StyleSheet.create({
    button: {   
        flex: 1,
        // backgroundColor: "#ffffaa",
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",

        // ios
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,

        // android
        elevation: 2
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: theme.padding.lg,
        gap: theme.gap.xs
    }, 
    iconContainer: {
        justifyContent: "center",
        alignItems: "center"

    },
    titleText: {
        fontSize: theme.typography.textSM.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900
    }
});