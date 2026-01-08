import { MyDefaultTheme } from "@/src/constants/theme";
import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export default function MyScreenContainer({children}: PropsWithChildren) {
    return (
        <View
            style={style.container}
        >
            {children}
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        backgroundColor: MyDefaultTheme.colors.background,
        // backgroundColor: "red",
        // height: "100%",
        flex: 1,
        // width: "100%",
        alignItems: "center",
        gap: theme.gap.xs,
        paddingHorizontal: theme.padding.md,
        paddingVertical: theme.padding.lg,
    }
})