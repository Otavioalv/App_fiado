import {  StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "@/src/theme";
import { useForm } from "react-hook-form";
import { loginSchema, LoginSchema } from "@/src/schemas/FormSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "@/src/context/authContext";
import { AppError } from "@/src/errors/AppError";
import Toast from "react-native-toast-message";
import { FormFieldsType, GenericForm } from "./GenericForm";
import Logo from "./Logo";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";
import { ButtonModern } from "../ui/ButtonModern";
import { useLogin as useLoginCliente } from "@/src/hooks/useClienteQueries";
import { useLogin as useLoginFornecedor} from "@/src/hooks/useFornecedorQueries";

const formFields: FormFieldsType<LoginSchema>[] = [
    {
        name: "nome", 
        title: "NOME",
        placeholder: "Nome de usuário",
    },
    {
        name: "senha",
        title: "SENHA*" ,
        placeholder: "Senha" ,
        secureTextEntry: true,
        isSecure: true,
    },
]


export type LoginFormProps = {
    title: string
}

export default function LoginForm({ title }:LoginFormProps) {
    const router = useRouter();
    const { signIn } = useSession();


    const {
        mutateAsync: loginCliente,
        isPending: isPendingCliente

    } = useLoginCliente();

    const {
        mutateAsync: loginFornecedor,
        isPending: isPendingFornecedor,
    } = useLoginFornecedor();




    const {control, handleSubmit} = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema)
    });

    // Login cliente
    const onSubmitCliente = async (data: LoginSchema) => {
        try {
            const token = await loginCliente(data);
            
            if(token) {
                signIn(token, "cliente");
            }
        }catch(err){
            if(err instanceof AppError){
                const {message} = err;
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
        }
    }

    // Login fornecedor
    const onSubmitFornecedor = async (data: LoginSchema) => {
        try {
            const token = await loginFornecedor(data);
            if(token){ 
                signIn(token, "fornecedor");
            }
        }catch(err) {
            if(err instanceof AppError){
                const {message} = err;
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
                })
            }
        }
    }

    // secureTextEntry
    return (
        <>  
            <SpacingScreenContainer>
                <Logo
                    size="L"
                />
            </SpacingScreenContainer>

            <GenericForm
                control={control}
                formFields={formFields}
                title={"Entre para continuar"}
                isLoading={isPendingCliente || isPendingFornecedor}
            >
                <Text style={style.descText}>
                    ENTRAR COMO
                </Text>
                <ButtonModern
                    placeholder="COMPRADOR" 
                    onPress={handleSubmit(onSubmitCliente)}
                />
                <ButtonModern
                    placeholder="FORNECEDOR" 
                    onPress={handleSubmit(onSubmitFornecedor)}
                />

                <Text style={style.title}>
                    OU
                </Text>

                <View style={style.formContainer}>
                    <Text style={style.descText}>
                        CADASTRE-SE COMO
                    </Text>
                    
                    <ButtonModern
                        placeholder="COMPRADOR" 
                        variant="outline"
                        onPress={() => router.push("/(auth)/registerCliente")}
                    />
                    <ButtonModern
                        placeholder="FORNECEDOR"
                        variant="outline"
                        onPress={() => router.push("/(auth)/registerFornecedor")}
                    />
                </View>
            </GenericForm>
        </>
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
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "bold",
        textAlign: "center"
    },
    descText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold"
    },
    formContainer: {
        gap: theme.gap.md, 
        paddingTop: 0,
        flex: 1
    }
})
