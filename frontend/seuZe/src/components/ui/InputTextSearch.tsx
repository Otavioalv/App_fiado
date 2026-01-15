import { theme } from "@/src/theme";
import { StyleSheet, TextInput, TextInputProps } from "react-native";

type InputTextSearchProps = TextInputProps;

export function InputTextSearch({...rest}: InputTextSearchProps) {
    return (
        <TextInput 
            {...rest}
            placeholderTextColor={theme.colors.darkGray}
            selectionColor={theme.colors.orange}
            style={[styles.container, rest.style]}
            multiline={false}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "blue",
        flex: 1,
        padding: theme.padding.sm,
        paddingLeft: 0,
        fontSize: theme.typography.textMD.fontSize
    }
});
