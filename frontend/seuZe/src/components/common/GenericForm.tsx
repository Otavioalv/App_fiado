import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Loading from "../ui/Loading";
import MyScreenContainer from "./MyScreenContainer";
import { theme } from "@/src/theme";
import { Control, FieldValues } from "react-hook-form";
import { ControlledInput, ControlledInputProps } from "./ControlledInput";
import { StyleSheet, View, Text } from "react-native";
import { ButtonModern } from "../ui/ButtonModern";
import { PropsWithChildren } from "react";


type SingleField<T extends FieldValues> = Omit<ControlledInputProps<T>, "control">;

export type FormFieldsType<T extends FieldValues> = 
    SingleField<T> | 
    SingleField<T>[];

export interface GenericFormProps<T extends FieldValues> extends PropsWithChildren{
    formFields: FormFieldsType<T>[],
    control: Control<T>,
    isLoading?: boolean,
    textButton?: string,
    onPress?: () => void,
    title?: string,
}


export function GenericForm<T extends FieldValues>({
    formFields,
    control,
    textButton,
    onPress,
    isLoading,
    title,
    children,
}: GenericFormProps<T>) {
    
    return (
        <KeyboardAwareScrollView
            style={{flex: 1}}
            contentContainerStyle={{flexGrow:1}} 
            enableOnAndroid={true}

            extraScrollHeight={300}

            enableAutomaticScroll={true}

            keyboardShouldPersistTaps="handled"
        >
            <Loading visible={!!isLoading}/>
            
            <Text
                style={styles.titleText}
            >
                {title}
            </Text>

            <MyScreenContainer 
                style={{
                    alignItems: "stretch", 
                    // backgroundColor: "red"
                }}
            >
                <View 
                    style={{gap: theme.gap.md}}
                >
                    {
                        formFields.map((field, index) => {
                            if(!Array.isArray(field)) {
                                return (
        
                                    <ControlledInput
                                        control={control}
                                        
                                        key={field.name + index} // Garantir q nao se repita
                                        
                                        name={field.name}
                                        title={field.title}
                                        placeholder={field.placeholder}
                                        secureTextEntry={field.secureTextEntry}
                                        isSecure={field.isSecure}
                                        keyboardType={field.keyboardType}
                                        disabled={field.disabled}
                                    />
                                )
                            }
                            //  em operfil formulariom ta bugado ptrq ta flwx 1 no uttommodern 
                            return (
                                <View
                                    style={styles.row}
                                    key={`row-${index}`} // Garantir q nao se repita
                                >   
                                    {
                                        field.map((f, i) => (
                                            <ControlledInput
                                                control={control}
                                                key={f.name + i} // Garantir q nao se repita
                                                name={f.name}
                                                title={f.title}
                                                placeholder={f.placeholder}
                                                secureTextEntry={f.secureTextEntry}
                                                isSecure={f.isSecure}
                                                keyboardType={f.keyboardType}
                                                disabled={f.disabled}
                                            />
                                        ))
                                    }
                                </View>
                            )
                        })
                    }
                    {children}

                    {textButton && (
                        <ButtonModern
                            placeholder={textButton}
                            onPress={onPress}
                        />
                    )}
                </View>
            </MyScreenContainer>    
        </KeyboardAwareScrollView>
    );
}

const styles = StyleSheet.create({
    row: {
        flex: 1, 
        flexDirection: "row", 
        gap: theme.gap.md
    },
    titleText: {
        // backgroundColor: "red",
        fontSize: theme.typography.textLG.fontSize,
        color: theme.colors.textNeutral900, 
        textAlign: "center",
        fontWeight: "bold",
    }
});
