import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";


type DefaultCardProps = PropsWithChildren
export function DefaultCard({children}:DefaultCardProps) {
    return (
        <View 
            style={styles.container}
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
