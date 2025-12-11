import { StyleSheet, Text, View } from "react-native";
import InputForm from "../ui/InputForm";
import ReturnButton from "./ReturnButton";
import { theme } from "@/src/theme";
import Button from "../ui/Button";
import { Controller, useForm } from "react-hook-form";
import { fornecedorRegisterSchema, FornecedorRegisterSchema } from "@/src/schemas/FornecedorRegisterSchema";
import { zodResolver } from "@hookform/resolvers/zod";

export default function RegisterFornecedor() {
    const {control, handleSubmit} = useForm<FornecedorRegisterSchema>({
        resolver: zodResolver(fornecedorRegisterSchema),
    })

    const onSubmit = (data: FornecedorRegisterSchema) => {
        console.log('dados enviados: ', data);
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

                <Controller
                    control={control}
                    name="nomeEstabelecimento"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"NOME DO ESTABELECIMENTO*"} 
                            placeholder="Estabelecimento"
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />

                <Controller
                    control={control}
                    name="logradouro"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"ENDEREÇO (RUA, AVENIDA, TV ...)*"} 
                            placeholder="Endereço"
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />      
                    }
                />
                

                <View style={style.doubleInput}>
                    <Controller
                        control={control}
                        name="numeroImovel"
                        render={({field, fieldState}) => 
                            <InputForm 
                                title={"NUMERO*"} 
                                placeholder="Numero" 
                                value={field.value}
                                onChangeText={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        }
                    />
                    

                    <Controller
                        control={control}
                        name="uf"
                        render={({field, fieldState}) => 
                            <InputForm 
                                title={"UF*"} 
                                placeholder="(am, pa, ac...)"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        }
                    />
                </View>
                
                <View style={style.doubleInput}>
                    <Controller
                        control={control}
                        name="bairro"
                        render={({field, fieldState}) => 
                            <InputForm 
                                title={"BAIRRO*"} 
                                placeholder="Bairro"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        }
                    />

                    <Controller
                        control={control}
                        name="cep"
                        render={({field, fieldState}) => 
                            <InputForm 
                                title={"CEP*"} 
                                placeholder="XXXXX-XXX"
                                value={field.value}
                                onChangeText={field.onChange}
                                errorMessage={fieldState.error?.message}
                            />
                        }
                    />
                </View>

                <Controller
                    control={control}
                    name="complemento"
                    render={({field, fieldState}) => 
                        <InputForm 
                            title={"COMPLEMENTO"} 
                            placeholder="Complemento"
                            value={field.value}
                            onChangeText={field.onChange}
                            errorMessage={fieldState.error?.message}
                        />
                    }
                />

                <Button placeholder="CADASTRAR" onPress={handleSubmit(onSubmit, (err) => console.log("erro: ", err))}/>
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
        gap: theme.gap.md
    },
    doubleInput: {
        flexDirection: "row", 
        justifyContent: 'space-between', 
        gap: theme.gap.md
    }
});