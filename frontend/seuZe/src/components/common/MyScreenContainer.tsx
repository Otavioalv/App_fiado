import { MyDefaultTheme } from "@/src/constants/theme";
import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";

type MyScreenContainerProps = PropsWithChildren & {style?: StyleProp<ViewStyle>};

export default function MyScreenContainer({children, style}: MyScreenContainerProps) {
    return (
        <SpacingScreenContainer
            style={[styles.container, style]}
        >
            {children}
        </SpacingScreenContainer>
    )
}

const styles = StyleSheet.create({
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
