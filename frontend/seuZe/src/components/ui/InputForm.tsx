import { theme } from "@/src/theme";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";


export type InputFormProps = TextInputProps & {
    title: string, 
    errorMessage?: string
}

export default function InputForm({title, errorMessage, ...rest}: InputFormProps) {
    return (
        <View style={style.container}>
            <Text>
                {title}
            </Text>

            <TextInput
                {...rest}
                style={style.textInput}
                placeholderTextColor={theme.colors.darkGray}
                selectionColor={theme.colors.orange}
            />
            {errorMessage && (
                <Text
                    style={style.textError}
                >
                    {errorMessage}
                </Text>
            )}
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        padding: 0,
        gap: theme.gap.xs,
        fontSize: theme.typography.textSM.fontSize,
        flex: 1
    }, 
    textInput: {
        backgroundColor: theme.colors.lightGray,
        borderRadius: theme.radius.sm,
        color: "black",
        // width: "100%",
        height: 60,
        paddingLeft: theme.padding.sm,
        fontSize: theme.typography.textLG.fontSize
    }, 
    textError: {
        color: "red"
    }
});
