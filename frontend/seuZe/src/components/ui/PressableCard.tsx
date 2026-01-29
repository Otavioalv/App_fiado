import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { Pressable, PressableProps, StyleSheet } from "react-native";

type PressableCardProps = PropsWithChildren & PressableProps

export function PressableCard({
    children,
    ...props
}: PressableCardProps) {
    
    return(
        <Pressable
            style={({pressed}) => [
                styles.container,
                pressed && styles.pressedContainer
            ]}
            {...props}
        >   
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",

        padding: theme.padding.sm,
        gap: theme.gap.sm,
        borderWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
    },
    
    pressedContainer: {
        backgroundColor: theme.colors.orange + "11",
    }
});