import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { Animated, StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";


type SectionContainerProps = PropsWithChildren & {
    title: string,
    style?: StyleProp<ViewStyle>,
    isLoading?: boolean,
}

export function SectionContainer({
    title, 
    style,
    children,
    isLoading = false, 
}: SectionContainerProps) {
    const anmOpacity = useAnimationOpacitySkeleton();

    return(
        <View style={[styles.container, style]}>

            {isLoading ? (
                <Animated.View style={[anmOpacity, styles.textSkeleton]}/>
            ) : (
                <Text style={styles.titleText}>
                    {title}
                </Text>
            )}

            
            {children}
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        paddingTop: theme.padding.md,
        width: "100%",
        flex: 1,
        gap: theme.gap.md
    },
    titleText: {
        ...theme.typography.title
        // ...theme.typography.textXL,
        // color: theme.colors.textNeutral900,
        // fontWeight: "900"
        // fontFamily: "Poppins"
    },
    textSkeleton: {
        width: 170,
        height: 20,
        borderRadius: 999,
    }
    
});
