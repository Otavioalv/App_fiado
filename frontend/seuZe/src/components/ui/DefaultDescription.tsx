import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { AppDefaultSizes } from "@/src/types/responseServiceTypes";
import { View, Text, StyleSheet, TextStyle, Animated } from "react-native";


export interface DefaultDescriptionProps {
    text1: string,
    text2: string,
    size: AppDefaultSizes
};

interface ComponentsStyles {
    // container: ViewStyle,
    text1: TextStyle,
    text2: TextStyle,
}

type SizeStyle = Record<AppDefaultSizes, ComponentsStyles>;

export function DefaultDescription({text1, text2, size}: DefaultDescriptionProps) {

    const sizeStyle: SizeStyle = {
        S: {
            text1: styles.text1Small,
            text2: styles.text2Small,
        },
        M: {
            text1: styles.text1Medium,
            text2: styles.text2Medium,
        },
        L: {
            text1: styles.text1Large,
            text2: styles.text2Large,
        }
    }

    const currentSize = sizeStyle[size];

    return (
        <View style={[styles.containerBase]}>
            {/* Texto de titulo*/}
            <Text style={[styles.text1Base, currentSize.text1]} numberOfLines={1}>
                {text1}
            </Text>

            {/* Texto de descriçaõ ou subtilulo */}
            <Text style={[styles.text2Base, currentSize.text2]} numberOfLines={1}>
                {text2}
            </Text>
        </View>
    );
}


type DefaultDescriptionSkeletonProps = {size: AppDefaultSizes}
export function DefaultDescriptionSkeleton({size}: DefaultDescriptionSkeletonProps) {
    const anmOpacity = useAnimationOpacitySkeleton();

    const sizeStyle: Record<AppDefaultSizes, number> = {
        S: 10, 
        M: 15,
        L: 20,
    }

    const currentSize = sizeStyle[size];


    return(
        <View style={styles.containerSkeleton}>
            <Animated.View style={[styles.text1Skeleton, anmOpacity, {height: currentSize}]}/>
            <Animated.View style={[styles.text2Skeleton, anmOpacity, {height: currentSize}]}/>
        </View>
    );
}


const styles = StyleSheet.create({
    // Container Estilo
    containerBase: {
        // backgroundColor: "red",
        flex: 1
    },
    containerSkeleton: {
        flex: 1, 
        gap: theme.gap.xs
    },

    // Text1 estilo
    text1Base: {
        color: theme.colors.textNeutral900,
        fontWeight: 'bold',
    },
    text1Small: {
        fontSize: theme.typography.textMD.fontSize,
    },
    text1Medium: {
        fontSize: theme.typography.textLG.fontSize,
    },
    text1Large: {

    },
    text1Skeleton: {
        // height: 15, 
        width: "40%", 
        borderRadius: 1000
    },

    // Text2 estilo
    text2Base: {
        color: theme.colors.textNeutral900,
    },
    text2Small: {
        fontSize: theme.typography.textSM.fontSize,
    },
    text2Medium: {
        fontSize: theme.typography.textMD.fontSize,
    },
    text2Large: {

    },
    text2Skeleton: {
        // height: 15, 
        width: "60%", 
        borderRadius: 1000
    }
});
