import { StyleSheet, Text, View } from "react-native";
import InputForm from "@/src/components/ui/InputForm";
import Button from "@/src/components/ui/Button";
import { useRouter } from "expo-router";
import { theme } from "@/src/theme";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/src/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";


export type LoginFormProps = {
    title: string
}

export default function LoginForm({ title }:LoginFormProps) {
    const router = useRouter();

    const {control, handleSubmit} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = (data: LoginSchema) => {
        console.log("Dados enviados: ", data);
    }

    // secureTextEntry
    return (
        <View style={style.container}>
            <Text style={style.title}>
                {title}
            </Text>

            <View style={style.formContainer}>
                <Controller
                    control={control}
                    name="nome"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title="NOME" 
                            placeholder="Nome de usuário"
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />

                <Controller
                    control={control}
                    name="senha"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title="SENHA" 
                            placeholder="Senha" 
                            secureTextEntry={true}
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />
                
                
                <Text style={style.descText}>
                    ENTRAR COMO
                </Text>

                <Button placeholder="COMPRADOR" onPress={handleSubmit(onSubmit)}/>
                <Button placeholder="FORNECEDOR" onPress={handleSubmit(onSubmit)}/>
            </View>

            <Text style={style.title}>
                OU
            </Text>

            <View style={style.formContainer}>
                <Text style={style.descText}>
                    CADASTRE-SE COMO
                </Text>
                
                <Button 
                    placeholder="COMPRADOR" 
                    onPress={() => router.push("/(cliente)/register")}
                />
                <Button 
                    placeholder="FORNECEDOR"
                    onPress={() => router.push("/(fornecedor)/register")}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        width: "100%",
        flex: 1,
        gap: theme.gap.md,
        paddingBottom: theme.padding.md
    },
    title: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "bold",
        textAlign: "center"
    },
    descText: {
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold"
    },
    formContainer: {
        gap: theme.gap.md, 
    }
})
