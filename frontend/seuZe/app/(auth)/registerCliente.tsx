import { FormFieldsType, GenericForm } from "@/src/components/common/GenericForm";
import { defaultRegisterSchema, DefaultRegisterSchema, LoginSchema } from "@/src/schemas/FormSchemas";
import { useSession } from "@/src/context/authContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Toast from "react-native-toast-message";
import { AppError } from "@/src/errors/AppError";
import { useLogin, useRegister } from "@/src/hooks/useClienteQueries";
import Logo from "@/src/components/common/Logo";
import { SpacingScreenContainer } from "@/src/components/ui/SpacingScreenContainer";
import ReturnButton from "@/src/components/common/ReturnButton";


const formFields: FormFieldsType<DefaultRegisterSchema>[] = [
    {
        name: "nome",
        title: "NOME*",
        placeholder: "Nome de usuário"
    },
    {
        name: "telefone",
        title: "TELEFONE*",
        placeholder: "(XX) XXXXX-XXXX",
        keyboardType: "phone-pad",
    },
    {
        name: "senha",
        title: "SENHA*" ,
        placeholder: "Senha" ,
        secureTextEntry: true,
        isSecure: true,
    },
    {
        name: "confirmarSenha",
        title: "CONFIRMAR SENHA*",
        placeholder: "Confirmar senha",
        secureTextEntry: true,
        isSecure: true,
    },
    {
        name: "apelido",
        title: "APELIDO" ,
        placeholder: "Apelido",
    }
];


export default function Register() {

    const {
        mutateAsync: registerCliente, 
        isPending: isPendingRegister
    } = useRegister();

    const {
        mutateAsync: loginCliente,
        isPending: isPendingLogin
    } = useLogin();


    const {signIn} = useSession();

    const {control, handleSubmit} = useForm<DefaultRegisterSchema>({
        resolver: zodResolver(defaultRegisterSchema),
        // values: {
        //     confirmarSenha: "senha@padrao12",
        //     nome: "nome sidsdfajfs",
        //     senha: "senha@padrao12",
        //     telefone: "92991827373",
        //     apelido: "apeliso dijfdsoija"
        // }
    });

    const onSubmit = async (data: DefaultRegisterSchema) => {
        try {
            
            if(await registerCliente(data)) {
                Toast.show({
                    type: "success",
                    text1: "Usuário cadastrado com sucesso",
                    text2: "Realizando login"
                })

                const loginData: LoginSchema = {nome: data.nome, senha: data.senha}
                const token = await loginCliente(loginData);
                
                if(token) {
                    signIn(token, "cliente");
                }
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
                });
            }
        }
    }

    return (
        <>
            <SpacingScreenContainer>
                <Logo size="L"/>

                <ReturnButton/>
            </SpacingScreenContainer>

            <GenericForm
                control={control}
                formFields={formFields}
                isLoading={isPendingRegister || isPendingLogin}
                textButton={"CADASTRAR"}
                onPress={handleSubmit(onSubmit)}
                title="CADASTRE-SE"
            />
        </>
    )
}
