import { Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { StyleSheet, View, Animated } from "react-native";
import { theme } from "@/src/theme";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { NotificationIcon } from "./NotificationIcon";

interface IconBgProps extends ComponentProps<typeof Feather> {
    isActivate?: boolean,
}

export function IconBg({
    style,
    isActivate = true,
    ...props
}: IconBgProps) {
    return (
        <View style={styles.container}> 
            <Feather 
                style={[
                    style,
                    styles.icon,
                    isActivate && (styles.iconAlert)
                ]}
                {...props}
            />
        </View>
    );
}

export function IconBgSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <Animated.View
            style={[anmOpacity, styles.iconSkeleton]}
        />
    );
}

const styles = StyleSheet.create({
    icon: {
        fontSize: theme.typography.textMD.fontSize,
        backgroundColor: theme.colors.pseudoLightGray,
        color: theme.colors.darkGray,
        borderRadius: 1000,
        padding: 10,
    },
    iconAlert: {
        backgroundColor: theme.colors.lightOrange,
        color: theme.colors.orange,
    },
    iconSkeleton: {
        width: 55,
        height: 55,
        borderRadius: 1000,
    },
    container: {
        // backgroundColor: "red",
        // alignContent: "flex-start",
        justifyContent: "center",
        alignItems: "flex-start",
    }
});
