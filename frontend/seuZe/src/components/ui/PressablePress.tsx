import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { Pressable, PressableProps, StyleProp, StyleSheet, ViewStyle } from "react-native";


type PressablePressProps = PropsWithChildren & PressableProps & {style?: StyleProp<ViewStyle>}

export function PressablePress({
    children, 
    style,
    ...props
}: PressablePressProps) { 
    return (
        <Pressable
            // android_ripple={{ color: 'orange', foreground: true }}

            style={({pressed}) => [
                style,
                pressed && styles.pressedContainer,
            ]}
            {...props}
        >   
            {children}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressedContainer: {
        backgroundColor: theme.colors.orange + "11",
    }
});
