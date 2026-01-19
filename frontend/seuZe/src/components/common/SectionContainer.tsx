import { theme } from "@/src/theme";
import { PropsWithChildren } from "react";
import { StyleSheet, Text, View } from "react-native";


type SectionContainerProps = PropsWithChildren & {
    title: string
}

export function SectionContainer({title, children}: SectionContainerProps) {
    return(
        <View style={styles.container}>
            <Text style={styles.titleText}>
                {title}
            </Text>
            
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        paddingTop: theme.padding.md,
        width: "100%",
        flex: 1,
        gap: theme.gap.md
    },
    titleText: {
        ...theme.typography.textXL,
        color: theme.colors.textNeutral900,
        fontWeight: "900"
        // fontFamily: "Poppins"
    }
    
});
