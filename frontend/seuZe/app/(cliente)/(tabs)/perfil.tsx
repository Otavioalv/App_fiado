import { FormFieldsType, GenericForm } from "@/src/components/common/GenericForm";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { BottomVersion } from "@/src/components/ui/BottomVersion";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { ProfileHeader } from "@/src/components/ui/ProfileHeader";
import { useSession } from "@/src/context/authContext";
import { AppError } from "@/src/errors/AppError";
import { useMe, useUpdate } from "@/src/hooks/useClienteQueries";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { basicFormSchema, BasicFormSchema } from "@/src/schemas/FormSchemas";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import Toast from "react-native-toast-message";



export default function Perfil() {
    const { signOut } = useSession();
    
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);
    const [isDisabled, setIsDisabled] = useState<boolean>(true);

    const { 
        data: userData, 
        isLoading: meLoad,
        refetch: fetchMe,
        error: errorMe,
        isError: isErrorMe,
    } = useMe();

    const {
        mutateAsync: updateUser,
        isPending: isUpdatingUser
    } = useUpdate();
    
    const {
        control, 
        handleSubmit, 
        reset
    } = useForm<BasicFormSchema>({
        resolver: zodResolver(basicFormSchema),
        defaultValues: {
            nome: "",
            telefone: "",
            apelido: ""    
        }
    });
    
    useErrorScreenListener(isErrorMe, errorMe, setErrorType);

    const formFields: FormFieldsType<BasicFormSchema>[] = useMemo(() => [
        {    
            name: "nome",
            title: "NOME*",
            placeholder: "Nome de usuário",
            disabled: isDisabled,
        },
        {
            name: "apelido",
            title: "APELIDO",
            placeholder: "Apelido",
            disabled: isDisabled,
        },
        {
            name: "telefone",
            title:"TELEFONE*" ,
            placeholder:"(XX) XXXXX-XXXX",
            keyboardType: "phone-pad",
            disabled: isDisabled,
        },
    ], [isDisabled]);

    const handleSetIsDisabled = () => {
        setIsDisabled(!isDisabled)
    }
    
    const handleCancelEdit = () => {
        reset({
            nome: userData?.nome ?? "",
            telefone: userData?.telefone ?? "",
            apelido: userData?.apelido ?? ""
        });

        setIsDisabled(true);
    }

    const onSubmit = async (data: BasicFormSchema) => {
        try {
            if(await updateUser(data)) {
                Toast.show({
                    type: "success",
                    text1: "Usuário atualizado com sucesso"
                })


                await fetchMe();
                handleSetIsDisabled();
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

    const logOut = () => {
        signOut();
    }

    
    useEffect(() => {
        if (userData) {
            reset({
                nome: userData.nome ?? "",
                telefone: userData.telefone ?? "",
                apelido: userData.apelido ?? ""
            });
        }
    }, [userData, reset]);




    return(
        <ScreenErrorGuard
            errorType={errorType}
            onRetry={fetchMe}
        >
            <ProfileHeader
                nome={userData?.nome || ""}
                apelido={userData?.apelido || ""}
            />

            <GenericForm
                control={control}
                formFields={formFields}
                isLoading={meLoad || isUpdatingUser}
            >   
                <ButtonModern 
                    placeholder={isDisabled ? "Atualizar Dados" : "Salvar Alterações"}
                    variant={isDisabled ? "outline" : "primary"}
                    onPress={isDisabled ? handleSetIsDisabled : handleSubmit(onSubmit)}
                />
                
                {!isDisabled && (
                    <ButtonModern
                        placeholder="Cancelar Edição"
                        variant="outline"
                        onPress={handleCancelEdit}
                    />
                )}

                <ButtonModern 
                    placeholder="Sair da Conta" 
                    variant={"ghost"}
                    onPress={logOut}
                    size="M"
                />  

                <BottomVersion 
                    version="1.0.0"
                />


            </GenericForm>
        </ScreenErrorGuard>
    )
}
