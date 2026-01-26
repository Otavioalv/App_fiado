import { FormFieldsType, GenericForm } from "@/src/components/common/GenericForm";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { ProfileHeader } from "@/src/components/ui/ProfileHeader";
import { useSession } from "@/src/context/authContext";
import { useBottomSheet } from "@/src/context/bottomSheetContext";
import { useMe } from "@/src/hooks/useClienteQueries";
import { basicFormSchema, BasicFormSchema } from "@/src/schemas/FormSchemas";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Text, View } from "react-native";



export default function Perfil() {
    const {closeSheet, openSheet} = useBottomSheet();

    const {session, signOut} = useSession();

    const { 
        data: userData, 
        isLoading: meLoad,
        refetch: fetchMe
    } = useMe();

    const [isDisabled, setIsDisabled] = useState<boolean>(true);


    const {control, handleSubmit, reset} = useForm<BasicFormSchema>({
        resolver: zodResolver(basicFormSchema),
        defaultValues: {
    nome: "",
    telefone: "",
    apelido: ""
  }
    });

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

    const teste = () => {
        requestAnimationFrame(() => {
            setIsDisabled(!isDisabled)
        });
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
    const handleOpenEdit = () => {
        console.log('abrir edição');
        openSheet(
            <BottomSheetView>
                 <ProfileHeader
                nome={userData?.nome || ""}
                apelido={userData?.apelido || ""}
            />
            <GenericForm
                control={control}
                formFields={formFields}
                isLoading={meLoad}
            >   
                <ButtonModern 
                    placeholder={"Atualizar Dados"}
                    onPress={teste}
                />

                <ButtonModern 
                    placeholder="Sair da Conta" 
                    variant={"ghost"}
                    onPress={logOut}
                    size="M"
                />
            </GenericForm>
            </BottomSheetView>,
            ["100%"],
            false
        );
    }
    const logOut = () => {
        signOut();
    }

    // const inputDisabled = true;

    return(
        <>
            <ProfileHeader
                nome={userData?.nome || ""}
                apelido={userData?.apelido || ""}
            />
            <GenericForm
                control={control}
                formFields={formFields}
                isLoading={meLoad}
            >   
                <ButtonModern 
                    placeholder={"Atualizar Dados"}
                    onPress={teste}
                />

                <ButtonModern 
                    placeholder="Sair da Conta" 
                    variant={"ghost"}
                    onPress={logOut}
                    size="M"
                />
            </GenericForm>
        </>
    )
}
