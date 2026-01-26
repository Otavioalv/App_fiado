import { FormFieldsType, GenericForm } from "@/src/components/common/GenericForm";
import { useSession } from "@/src/context/authContext";
import { AppError } from "@/src/errors/AppError";
import { fornecedorRegisterSchema, FornecedorRegisterSchema, LoginSchema } from "@/src/schemas/FormSchemas";
import { login, register } from "@/src/services/fornecedorService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";


const formFields: FormFieldsType<FornecedorRegisterSchema>[] = [
    {
        name: "nome",
        title: "NOME*",
        placeholder: "Nome de usuário",
        // disabled: true,
    },
    {
        name: "telefone",
        title:"TELEFONE*" ,
        placeholder:"(XX) XXXXX-XXXX",
        keyboardType: "phone-pad",
    },
    {
        name: "senha",
        title:"SENHA*",
        placeholder:"Senha",
        secureTextEntry: true,
        isSecure: true,
        // disabled: true
    },
    {
        name: "confirmarSenha",
        title:"CONFIRMAR SENHA*",
        placeholder:"Confirmar senha",
        secureTextEntry: true,
        isSecure: true,
    },
    {
        name: "apelido",
        title: "APELIDO",
        placeholder: "Apelido",
    },
    {
        name: "nomeEstabelecimento",
        title: "NOME DO ESTABELECIMENTO*",
        placeholder: "Estabelecimento",
    },
    {
        name: "logradouro",
        title: "ENDEREÇO (RUA, AVENIDA, TV ...)*" ,
        placeholder: "Endereço",
    },
    [
        {
            name: "numeroImovel",
            title: "NUMERO*" ,
            placeholder: "Numero" ,
        },
        {
            name: "uf",
            title: "UF*" ,
            placeholder: "(am, pa, ac...)",
        }
    ],
    [
        {
            name: "bairro",
            title: "BAIRRO*" ,
            placeholder: "Bairro",
        },
        {
            name: "cep",
            title: "CEP*" ,
            placeholder: "XXXXX-XXX",
        }
    ],
    {
        name: "complemento",
        title: "COMPLEMENTO" ,
        placeholder: "Complemento",
    }
];




export default function Teste() {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {signIn} = useSession();

    const {control, handleSubmit} = useForm<FornecedorRegisterSchema>({
        resolver: zodResolver(fornecedorRegisterSchema),
        values: {
            nome: "valor inicial dois", 
            bairro: "sdfa", 
            cep: "23131232", 
            confirmarSenha: "senhapadrao@12", 
            logradouro: "ssdfadsadas", 
            nomeEstabelecimento: "senhapadrao@12", 
            numeroImovel: "sdfas", 
            senha: "senhapadrao@12", 
            telefone: "92991492939", 
            uf: "am", 
            apelido: "eopelido", 
            complemento: ""
        }
    })

    const onSubmit = async (data: FornecedorRegisterSchema) => {
        try{
            setIsLoading(true);
            if(await register(data)){
                Toast.show({
                    type: "success",
                    text1: "Usuário cadastrado com sucesso",
                    text2: "Realizando login"
                });

                const loginData: LoginSchema = {nome: data.nome, senha: data.senha};
                const token = await login(loginData);
                
                if(token) {
                    signIn(token, "fornecedor");
                }
            }
        }catch(err) {
            if(err instanceof AppError){
                const {message} = err;
                Toast.show({
                    type: "error",
                    text1: message,
                    text2: "Por favor tente novamente"
                });
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
        <>
            <GenericForm
                control={control}
                formFields={formFields}
                isLoading={isLoading}
                textButton={"CADASTRAR"}
                onPress={handleSubmit(onSubmit)}
            />
        </>
    );
}
