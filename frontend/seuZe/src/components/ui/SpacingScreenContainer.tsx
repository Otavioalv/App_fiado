import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View, ViewProps } from "react-native";


type SpacingScreenContainerProps = PropsWithChildren & ViewProps;

export function SpacingScreenContainer({
    children, 
    style,
    ...viewProps
}: SpacingScreenContainerProps) {
    return (
        <View 
            style={[defaultStyles.container, style]}
            {...viewProps}
        >  
            {children}
        </View> 
    );
}

const defaultStyles = StyleSheet.create({
    container: {
        padding: theme.padding.sm,
    }
});

