import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";


type SpacingScreenContainerProps = PropsWithChildren & {style?: ViewStyle};

export function SpacingScreenContainer({children, style}: SpacingScreenContainerProps) {
    return (
        <View style={[defaultStyles.container, style]}>  
            {children}
        </View> 
    );
}

const defaultStyles = StyleSheet.create({
    container: {
        padding: theme.padding.sm,
    }
});

