import { theme } from "@/src/theme";
import { useEffect, useRef, memo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";


export type BasicInfoCardProps = {
    title: string,
    info: string
}

export function BasicInfoCard({info, title}: BasicInfoCardProps) {
    return (
        <View 
            style={styles.container}
        >
            <Text style={styles.textTitle} numberOfLines={1}>
                {title}
            </Text>
            <Text style={styles.infoText} numberOfLines={1}>
                {info}
            </Text>
        </View>
    );
}

export const MemoBasicInfoCard = memo(BasicInfoCard);

export function BasicInfoCardSkeleton() {
    const anmOpacity = useRef(new Animated.Value(.5)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(anmOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(anmOpacity, {
                    toValue: .5,
                    duration: 800,
                    useNativeDriver: true
                })
            ])
        );

        animation.start();
    }, [anmOpacity])

    return (
        <View style={[styles.container, { gap: 8 }]}> 
            <Animated.View style={[styles.skeletonTitle, {opacity: anmOpacity}]}/>
            <Animated.View style={[styles.skeletonInfo, {opacity: anmOpacity}]}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",

        // ios
        shadowColor: "#000000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,

        // android
        elevation: 2,
        padding: theme.padding.md,
    },
    textTitle: {
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900
    }, 
    infoText: {
        fontSize: theme.typography.textSM.fontSize, 
        color: theme.colors.textNeutral900
    },
    skeletonTitle: {
        height: 10, 
        width: "95%", 
        backgroundColor: theme.colors.pseudoLightGray, 
        borderRadius: theme.radius.xs
    },
    skeletonInfo: {
        height: 10, 
        width: "50%", 
        backgroundColor: theme.colors.pseudoLightGray, 
        borderRadius: theme.radius.xs
    }
});