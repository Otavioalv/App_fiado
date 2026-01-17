import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { memo } from "react";
import { Animated, Pressable, StyleSheet, Text} from "react-native";


interface ButtonChipProps {
    label: string,
    isSelected: boolean,
    onPress: () => void,
}


export function ButtonChip({
    label, 
    onPress,
    isSelected = false,
}: ButtonChipProps) {
    return (
        <Pressable
            style={[
                styles.container, 
                isSelected ? 
                    styles.containerSelected : 
                    styles.containerUnselected
            ]}
            onPress={onPress}
        >
            <Text
                style={[
                    styles.text,
                    isSelected ? 
                        styles.textSelected : 
                        styles.textUnselected
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

export const MemoButtonChip = memo(ButtonChip);


export function ButtonChipSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <Animated.View
            style={[
                styles.containerSkeleton,
                anmOpacity
            ]}
        />
    );
}

export const MemoButtonChipSkeleton = memo(ButtonChipSkeleton);


const styles = StyleSheet.create({
    // Container
    container: {
        padding: 10,
        paddingHorizontal: theme.padding.sm,
        borderRadius: 10000,
    }, 
    containerSelected: {
        backgroundColor: theme.colors.orange,
    },
    containerUnselected: {
        backgroundColor: "white",
        borderWidth: 1, 
        borderColor: theme.colors.pseudoLightGray
    },
    containerSkeleton: {
        width: 110, 
        height: 40, 
        borderRadius: 1000,
    },
    // Texto
    text: {
        fontWeight: "bold",
        fontSize: theme.typography.textSM.fontSize
    },
    textSelected: {
        color: "white",
    },
    textUnselected: {
        color: theme.colors.textNeutral900
    }
});