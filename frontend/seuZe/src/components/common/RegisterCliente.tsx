import { StyleSheet, Text, View } from "react-native";
import InputForm from "../ui/InputForm";
import ReturnButton from "./ReturnButton";
import { theme } from "@/src/theme";
import Button from "../ui/Button";
import { useForm, Controller } from "react-hook-form"
import { defaultRegisterSchema, DefaultRegisterSchema } from "@/src/schemas/DefaultRegisterSchema";
import { zodResolver } from '@hookform/resolvers/zod'
import Loading from "../ui/Loading";
import { useState } from "react";
import { login, register } from "@/src/services/clienteService";
import { AppError } from "@/src/errors/AppError";
import Toast from "react-native-toast-message";
import { LoginSchema } from "@/src/schemas/LoginSchema";
import { useSession } from "@/src/context/authContext";

export default function RegisterCliente() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {signIn} = useSession();

    const {control, handleSubmit} = useForm<DefaultRegisterSchema>({
        resolver: zodResolver(defaultRegisterSchema)
    });

    const onSubmit = async (data: DefaultRegisterSchema) => {
        try {
            setIsLoading(true);
            if(await register(data)) {
                Toast.show({
                    type: "success",
                    text1: "Usuário cadastrado com sucesso",
                    text2: "Realizando login"
                })

                const loginData: LoginSchema = {nome: data.nome, senha: data.senha}
                const token = await login(loginData);
                
                if(token) {
                    signIn(token, "cliente");
                }
            }
        }catch(err) {    
            if(err instanceof AppError){
                const {message} = err;
                // console.log("aaaaaaaaaaaaaaaAAAAAAAAAAAA");
                Toast.show({
                    type: "error",
                    text1: message,
                    text2: "Por favor tente novamente"
                })
            }else {
                Toast.show({
                    type: "error",
                    text1: "Recurso não encontrado",
                    text2: "Por favor tente novamente"
                });
            }
        }finally {
            setIsLoading(false);
        }
    }

    return (
        <View
            style={style.container}
        >
            <Loading visible={isLoading}/>
            {/* CRIAR COMPONENTE EXPECIFICO PRA BACK */}
            <ReturnButton/>

            {/* Formulario */}
            <Text style={style.title}>
                CADASTRE-SE
            </Text>

            <View style={style.formContainer}>
                <Controller 
                    control={control} 
                    name="nome" 
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"NOME*"} 
                            placeholder="Nome de usuário" 
                            value={field.value} 
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />


                <Controller 
                    control={control}
                    name="telefone"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"TELEFONE*"} 
                            placeholder="(XX) XXXXX-XXXX" 
                            keyboardType="phone-pad"
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
                            title={"SENHA*"} 
                            placeholder="Senha" 
                            secureTextEntry={true}
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />

                <Controller
                    control={control}
                    name="confirmarSenha"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"CONFIRMAR SENHA*"} 
                            placeholder="Confirmar senha" 
                            secureTextEntry={true}
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />

                <Controller
                    control={control}
                    name="apelido"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"APELIDO"} 
                            placeholder="Apelido"
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />
                
                <Button 
                    placeholder="CADASTRAR" 
                    onPress={handleSubmit(onSubmit)}
                />
            </View>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        // backgroundColor: "red",
        width: "100%",
        flex: 1,
        paddingBottom: theme.padding.md
    },
    title: {
        fontSize: 20, 
        fontWeight: "bold",
        textAlign: "center"
    },
    formContainer: {
        gap: theme.gap.md,
    }
});