import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export interface ButtonFilterProps {
    title: string,
    selected: string, 
    onPress: (title: string) => void,
}

export function ButtonFilter({title, onPress, selected}: ButtonFilterProps) {
    const isValue:boolean = title === selected;

    return (
        <Pressable 
            style={styles.buttonOpc}
            onPress={() => onPress(title)}
        >
            <Text
                style={[
                    styles.textBtt, 
                    isValue ? styles.textchecked : styles.textNeutral
                ]}
            >
                {title}
            </Text>

            <Feather
                name={isValue ? "check-circle" : "circle"}
                style={[
                    styles.textBtt, 
                    isValue ? styles.textchecked : styles.textNeutral
                ]}
            />
        </Pressable>
    )
}

export const MemoButtonFilter = memo(ButtonFilter);



const styles = StyleSheet.create({
    buttonOpc: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: theme.padding.md,
        borderBottomWidth: 1,
        borderColor: theme.colors.pseudoLightGray

    },

    // Texto
    textBtt: {
        fontSize: theme.typography.textMD.fontSize
    },
    textchecked: {
        color: theme.colors.orange
    },
    textNeutral: {
        color: theme.colors.textNeutral900
    },
});