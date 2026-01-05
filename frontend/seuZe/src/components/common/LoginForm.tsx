import { Alert, StyleSheet, Text, View } from "react-native";
import InputForm from "@/src/components/ui/InputForm";
import Button from "@/src/components/ui/Button";
import { useRouter } from "expo-router";
import { theme } from "@/src/theme";
import { Controller, useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/src/schemas/LoginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {login as loginCliente} from "@/src/services/clienteService"
import {login as loginFornecedor} from "@/src/services/fornecedorService";
import { useState } from "react";
import Loading from "../ui/Loading";
import { useSession } from "@/src/context/authContext";
import { AppError } from "@/src/errors/AppError";
import Toast from "react-native-toast-message";

export type LoginFormProps = {
    title: string
}

export default function LoginForm({ title }:LoginFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { signIn } = useSession();

    const {control, handleSubmit} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmitCliente = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            const token = await loginCliente(data);
            if(token) {
                signIn(token, "cliente");
                // Alert.alert("TESTE: ", "token salvo na memoria privada");
            }
        }catch(err){
            if(err instanceof AppError){
                const {message, type} = err;
                console.log("[LOGIN COMPRADOR] Erro: ", message);
                console.log("[LOGIN COMPRADOR] Type: ", type);
                console.log("\n");

                Toast.show({
                    type: "error",
                    text1: "Nome de usuário ou senha incorreto!",
                    text2: "Por favor tente novamente"

                })
                
            }else {
                console.log("[Load Data] Erro Desconhecido: ", err, "\n");
            }
        }finally{
            setIsLoading(false);
        }

    }

    const onSubmitFornecedor = async (data: LoginSchema) => {
        setIsLoading(true);
        // EDITAR
        try {
            const token = await loginFornecedor(data);
            if(token){ 
                signIn(token, "fornecedor");
            }
        }catch(err) {
            if(err instanceof AppError){
                const {message, type} = err;
                console.log("[LOGIN FORNECEDOR] Erro: ", message);
                console.log("[LOGIN FORNECEDOR] Type: ", type);
                console.log("\n");

                Toast.show({
                    type: "error",
                    text1: "Nome de usuário ou senha incorreto!",
                    text2: "Por favor tente novamente"

                })
                
            }else {
                console.log("[Load Data] Erro Desconhecido: ", err, "\n");
            }
        }finally {
            setIsLoading(false);
        }

        
    }

    // secureTextEntry
    return (
        <View style={style.container}>
            
            <Loading visible={isLoading}/>

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

                <Button placeholder="COMPRADOR" onPress={handleSubmit(onSubmitCliente)}/>
                <Button placeholder="FORNECEDOR" onPress={handleSubmit(onSubmitFornecedor)}/>
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
                    onPress={() => router.push("/(auth)/registerCliente")}
                />
                <Button 
                    placeholder="FORNECEDOR"
                    onPress={() => router.push("/(auth)/registerFornecedor")}
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
