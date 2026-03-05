import { ControlledInput } from "@/src/components/common/ControlledInput";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { ButtonModern } from "@/src/components/ui/ButtonModern";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";
import Loading from "@/src/components/ui/Loading";
import { PressablePress } from "@/src/components/ui/PressablePress";
import { SpacingScreenContainer } from "@/src/components/ui/SpacingScreenContainer";
import { useProductAdd } from "@/src/hooks/useFornecedorQueries";
import { produtosAddFormSchema, ProdutosAddFormType } from "@/src/schemas/FormSchemas";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useFieldArray, useForm } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";


export default function AddProduct() {
    const router = useRouter(); 

    const {
        mutateAsync: productAdd,
        isPending: isPendingProductAdd,
    } = useProductAdd();

    const {
        control, 
        handleSubmit,
    } = useForm<ProdutosAddFormType>({
        resolver: zodResolver(produtosAddFormSchema),
        defaultValues: {
            produtos: [{
                nome: "",
                preco: "",
                quantidade: ""
            }]}
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "produtos"
    });

    const handleRemoveForm = (index: number) => remove(index)
    const handleAddProdForm = () => append({ nome: "", quantidade: "", preco: ""});

     const onSubmit = async (data: ProdutosAddFormType) => {
        try {
            console.log("submit: ", JSON.stringify(data, null, "  "));
            if(await productAdd(data)) {
                Toast.show({
                    type: "success",
                    text1: "Produto produtos adicionados com sucesso"
                });
                
                router.back();
            }
        }catch(err) {
            console.log(err);
        }
    }

    return (
        <>
            <Loading
                visible={isPendingProductAdd}
            />
            <HeaderBottomContainer style={styles.headerContainer}>
                <ButtonIcon
                    iconName="arrow-left"
                    variant="ghost"
                    onPress={() => router.back()}
                />
                <Text style={styles.title}>
                    Adicionar produtos
                </Text>
            </HeaderBottomContainer>

            <KeyboardAwareScrollView
                style={{flex: 1}}
                contentContainerStyle={{flexGrow:1}} 
                enableOnAndroid={true}
    
                extraScrollHeight={300}
    
                enableAutomaticScroll={true}
    
                keyboardShouldPersistTaps="handled"
            >
                <MyScreenContainer 
                    style={{alignItems: "stretch"}}
                >
                    {fields.map((item, index) => (
                        <View 
                            style={styles.formCardContainer}
                            key={item.id} 
                        >   
                            <View style={styles.headerDetailFormCard}>
                                <View style={styles.infoTextSec}>
                                    <View style={styles.numberCountBg}>
                                        <Text style={styles.numberText}>
                                            {index + 1}
                                        </Text>
                                    </View>

                                    <Text>
                                        Detalhes do Produto
                                    </Text>
                                </View>

                                <PressablePress 
                                    style={styles.btnRemoveContainer}
                                    onPress={() => handleRemoveForm(index)} 
                                >
                                    <Feather
                                        name="trash-2"
                                        style={styles.textRemove}
                                    />

                                    <Text
                                        style={styles.textRemove}
                                    >
                                        Remover
                                    </Text>
                                </PressablePress>
                            </View>

                            <View style={styles.formSection}>
                                <ControlledInput
                                    control={control}
                                    key={`produtos.${index}.nome` + index} // Garantir q nao se repita
                                    name={`produtos.${index}.nome`}
                                    title={"Nome do Produto"}
                                    placeholder={"Farinha de tapioca"}
                                />

                                <View style={styles.twoSectionForm}>
                                    <View style={{flex: 1}}>
                                        <ControlledInput
                                            control={control}
                                            key={`produtos.${index}.preco` + index}
                                            name={`produtos.${index}.preco`}
                                            title={"Preço (R$)"}
                                            placeholder={"5.75"}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                    
                                    <View style={{flex: 1}}>
                                        <ControlledInput
                                            control={control}
                                            key={`produtos.${index}.quantidade` + index}
                                            name={`produtos.${index}.quantidade`}
                                            title={"Unidade"}
                                            placeholder={"50"}
                                            keyboardType="phone-pad"
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}


                    <ButtonModern
                        iconName="plus"
                        placeholder="Adicionar outro item"
                        onPress={handleAddProdForm}
                        variant="outline"
                    />
                </MyScreenContainer>
            </KeyboardAwareScrollView>
            <SpacingScreenContainer style={styles.bottomContainer}>
                <ButtonModern
                    placeholder={"Cadastrar Produtos"}
                    size="L"
                    variant="primary"
                    onPress={handleSubmit(onSubmit)}
                    disabled={isPendingProductAdd}
                />
            </SpacingScreenContainer>

        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: "row", 
        alignItems: "center",
    },
    title: {
        ...theme.typography.title
    },

    formCardContainer: {
        overflow: "hidden",
    },

    headerDetailFormCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: theme.radius.sm,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: "#fbfbfb",
        padding: theme.padding.sm,
    },
    formSection: {
        padding: theme.padding.sm,
        borderWidth: 1, 
        borderColor: theme.colors.pseudoLightGray,
        borderTopStartRadius: 0, 
        borderTopRightRadius: 0,
        borderRadius: theme.radius.sm,
        gap: theme.gap.sm,
    },

    numberCountBg: {
        backgroundColor: "#fcebe3",
        padding: theme.padding.xs,
        paddingHorizontal: 10,
        borderRadius: 1000,
    },
    infoTextSec: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.gap.xs
    },
    numberText: {
        color: theme.colors.orange,
        fontWeight: "bold",
        fontSize: theme.typography.textMD.fontSize,
    },
    btnRemoveContainer: {
        flexDirection: "row", 
        alignItems: "center",
        gap: theme.gap.xs
    },
    textRemove: {
        color: "red",
        fontSize: theme.typography.textSM.fontSize,
    },
    twoSectionForm: {
        flex: 1,
        flexDirection: "row",
        gap: theme.gap.sm,
    },

    addItemBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderStyle: "dotted",
        borderColor: theme.colors.orange,
        borderRadius: theme.radius.sm,
        padding: theme.padding.md,
        gap: theme.gap.sm,
        
    },
    bottomContainer: {
        gap: theme.gap.sm,
        borderTopColor: theme.colors.pseudoLightGray,
        borderTopWidth: 1,
    },
});
