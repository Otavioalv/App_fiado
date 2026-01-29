import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";


type HeaderBottomContainerProps = PropsWithChildren & {style?: StyleProp<ViewStyle>}

export function HeaderBottomContainer({
    style, 
    children
}: HeaderBottomContainerProps) {
    return (
        <View
            style={[
                styles.container,
                style
            ]}
        >
            {children}
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        // backgroundColor: "#ffffff",
        
        // flex: 1,
        // flexDirection: "row",
        // justifyContent: "space-between",
        // alignItems: "center",
        
        width: "100%",
        borderBottomWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
        paddingHorizontal: theme.padding.md,
        paddingVertical: theme.padding.sm,
    }
});