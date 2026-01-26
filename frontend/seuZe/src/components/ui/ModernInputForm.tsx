import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";


export type ModernInputFormProps = TextInputProps & {
    title: string, 
    errorMessage?: string,
    disabled?: boolean,
    isSecure?: boolean,
}

export default function ModernInputForm({
    title, 
    errorMessage, 
    disabled = false, 
    isSecure = false,
    secureTextEntry,
    ...rest
}: ModernInputFormProps) {
    const [showPassword, setShowPassWord] = useState<boolean>(false);
    // console.log(title, isSecure, rest.value);

    const handleSetShowPassword = () => {
        setShowPassWord(!showPassword);
    }


    return (
        <View style={styles.container}>
            <Text 
                style={styles.titleInput}
            >
                {title}
            </Text>
        
            <View style={[
                styles.inputWrapper, 
                !disabled ? styles.inputEnable : undefined
            ]}>
                <TextInput
                    style={[styles.textInput]}
                    placeholderTextColor={theme.colors.darkGray}
                    selectionColor={theme.colors.orange}
                    editable={!disabled}
                    secureTextEntry={isSecure && !showPassword}
                    {...rest}
                />

                {isSecure && (
                    <Pressable
                        style={styles.buttonIcon}
                        onPress={handleSetShowPassword}
                    >   
                        <Feather
                            name={showPassword ? "eye" : "eye-off"}
                            style={[
                                styles.eyeIcon, 
                                showPassword && styles.eyeIconActivated
                            ]} 
                        />
                    </Pressable>
                )}            

            </View>

            {errorMessage && (
                <Text
                    style={styles.textError}
                >
                    {errorMessage}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 0,
        gap: theme.gap.xs,
        fontSize: theme.typography.textSM.fontSize,
        flex: 1, // Testar
        // backgroundColor: "green",
    }, 
    textInput: {
        flex: 1,
        paddingLeft: theme.padding.sm,
        fontSize: theme.typography.textMD.fontSize,
        color: theme.colors.textNeutral900
        // backgroundColor: "red",
    }, 
    inputWrapper: {
        // flex: 1,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        borderRadius: theme.radius.sm,
        color: "black",
        // width: "100%",
        height: 60,
        // paddingLeft: theme.padding.sm,
        fontSize: theme.typography.textMD.fontSize,
    },
    inputEnable: {
        borderWidth: 1,
        borderColor: theme.colors.pseudoLightGray
    },
    titleInput: {
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.textNeutral900,
        // color: theme.colors.pseudoLightGray 
    },  
    textError: {
        color: "red"
    },
    buttonIcon: {
        // backgroundColor: "blue",
        height: "100%",
        // width: 30,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.padding.sm
    },
    eyeIcon: {
        color: theme.colors.pseudoLightGray,
        fontSize: theme.typography.textLG.fontSize,
        // flex: 1,
        // backgroundColor: "red",
        // height: "100%",
    },
    eyeIconActivated: {
        color: theme.colors.orange
    }
});
