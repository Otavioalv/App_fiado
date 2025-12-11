import { StyleSheet, Text, View } from "react-native";
import InputForm from "../ui/InputForm";
import ReturnButton from "./ReturnButton";
import { theme } from "@/src/theme";
import Button from "../ui/Button";
import { useForm, Controller } from "react-hook-form"
import { defaultRegisterSchema, DefaultRegisterSchema } from "@/src/schemas/DefaultRegisterSchema";
import { zodResolver } from '@hookform/resolvers/zod'

export default function RegisterCliente() {
    
    const {control, handleSubmit} = useForm<DefaultRegisterSchema>({
        resolver: zodResolver(defaultRegisterSchema)
    });

    const onSubmit = (data: DefaultRegisterSchema) => {
        console.log("dados enviados: ", data);
    }

    return (
        <View
            style={style.container}
        >
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
                    onPress={handleSubmit(onSubmit, (err) => console.log("erro: ", err))}
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