import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";


type DefaultCardProps = PropsWithChildren & {style?: StyleProp<ViewStyle>};

export function DefaultCard({children, style}:DefaultCardProps) {
    return (
        <View 
            style={[styles.container, style]}
        >
            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        borderRadius: theme.radius.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",

        padding: theme.padding.sm,
        gap: theme.gap.sm,
        borderWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
    }
});
