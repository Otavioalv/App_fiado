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
        alignItems: "center",
        flex: 1,
        gap: theme.gap.xs,
        paddingHorizontal: theme.padding.md,
        // paddingBottom: theme.padding.md
    }
})