import { Feather } from "@expo/vector-icons";
import { DefaultCard } from "./DefaultCard";
import { Animated, StyleSheet, Text } from "react-native";
import { memo } from "react";
import { theme } from "@/src/theme";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";


export interface CardAboutInfoProps {
    info: string,
    iconName: keyof typeof Feather.glyphMap,
}

export function CardAboutInfo({
    info, 
    iconName,
}: CardAboutInfoProps) {
    return (
        <DefaultCard style={styles.container}>
            <Feather
                style={styles.icon}
                name={iconName}
            />
            <Text
                style={styles.text}
            >
                {info}
            </Text>
        </DefaultCard>
    );
};

export const MemoCardAboutInfo = memo(CardAboutInfo);

export function CardAboutInfoSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <DefaultCard style={styles.container}>
            <Animated.View style={[anmOpacity, styles.iconSkeleton]}/>
            <Animated.View style={[anmOpacity, styles.textSkeleton]}/>
        </DefaultCard>

    )
}

export const MemoCardAboutInfoSkeleton = memo(CardAboutInfoSkeleton);

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: theme.padding.md,
    },
    
    // ICONE
    icon: {
        color: theme.colors.darkGray,
        fontSize: theme.typography.textMD.fontSize
    },
    iconSkeleton: {
        width: 20,
        height: 20,
        borderRadius: 1000
    },


    // TEXTO
    text: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        flex: 1,

    },
    textSkeleton: {
        borderRadius: 1000,
        width: 200,
        height: 13,
    }
});
