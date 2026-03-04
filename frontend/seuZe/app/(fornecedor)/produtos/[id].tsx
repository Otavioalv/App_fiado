import { FormFieldsType, GenericForm } from "@/src/components/common/GenericForm";
import { ScreenErrorGuard } from "@/src/components/common/ScreenErrorGuard";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { useProductDeleteSingle, useProductSingleFromId, useProductUpdate } from "@/src/hooks/useFornecedorQueries";
import { ProdutoSimpleFormShema, produtoSimpleFormShema } from "@/src/schemas/FormSchemas";
import { theme } from "@/src/theme";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import Toast from "react-native-toast-message";


export default function EditProduct() {
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string}>();
    
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);

    const {
        data: dataProduto,
        isLoading: isLoadingProduto,
        refetch: refetchProduto,
        error: errorProduto,
        isError: isErrorProduto,
    } = useProductSingleFromId(id);

    const {
        control, 
        handleSubmit,
        reset,
    } = useForm<ProdutoSimpleFormShema>({
        resolver: zodResolver(produtoSimpleFormShema),
        defaultValues: {
            nome: "",
            preco: "0.0",
            quantidade: "1"
        }
    });


    const {
        mutateAsync: productUpdate,
        isPending: isPendingProductUpdate,
    } = useProductUpdate();

    const {
        mutateAsync: productDelete,
        isPending:  isPendingProductDelete,
    } = useProductDeleteSingle();
    
    const formFields = useMemo<FormFieldsType<ProdutoSimpleFormShema>[]>(() => [
        {
            name: "nome",
            title: "Nome do produto",
            placeholder: "Nome do produto",
        },
        {
            name: "preco",
            title: "Preço R$",
            placeholder: "00.00",
            keyboardType: "phone-pad",
        },
        {
            name: "quantidade",
            title: "Quantidade",
            placeholder: "0",
            keyboardType: "phone-pad",
        }
    ], []);


    const onSubmit = async (data: ProdutoSimpleFormShema) => {
        try {
            console.log("submit");
            if(await productUpdate(data)) {
                Toast.show({
                    type: "success",
                    text1: "Produto atualizado com sucesso"
                })

                await refetchProduto();

                // seleciona bagulho
            }
        }catch(err) {
            console.log(err);
        }
    }

    const onDeleteProd = async () => {
        try {
            console.log("submit");
            if(await productDelete(Number(id))) {
                router.back();

                Toast.show({
                    type: "success",
                    text1: "Produto deletado com sucesso"
                })

                // await refetchProduto();
            }
        }catch(err) {
            console.log(err);
        }
    }

    useEffect(() => {
        if(dataProduto) {
            console.log(dataProduto);
            reset({
                id_produto: id,
                nome: dataProduto.nome,
                preco: String(dataProduto.preco),
                quantidade: String(dataProduto.quantidade)
            });
        }
    }, [dataProduto, reset, id]);

    useErrorScreenListener(isErrorProduto, errorProduto, setErrorType);
    return (
        <ScreenErrorGuard errorType={errorType} onRetry={refetchProduto}>
            <HeaderBottomContainer style={styles.headerContainer}>
                <ButtonIcon
                    iconName="arrow-left"
                    variant="ghost"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>
                    Editar produto
                </Text>
            </HeaderBottomContainer>
            
            <GenericForm 
                control={control}
                formFields={formFields}
                isLoading={isLoadingProduto || isPendingProductUpdate || isPendingProductDelete}
                textButton="Atualizar"
                onPress={handleSubmit(onSubmit)}
            >
                <ButtonModern   
                    placeholder="Deletar produto"
                    variant="outline"
                    onPress={onDeleteProd}
                />
            </GenericForm>
        </ScreenErrorGuard>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center",
    },
    title: {
        ...theme.typography.title
    },
});
