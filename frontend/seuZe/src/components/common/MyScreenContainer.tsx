import { MyDefaultTheme } from "@/src/constants/theme";
import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";

export default function MyScreenContainer({children}: PropsWithChildren) {
    return (
        <SpacingScreenContainer
            style={style.container}
        >
            {children}
        </SpacingScreenContainer>
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
    }
})