import { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Text, View } from "react-native";
import { TextProductPrice } from "../ui/TextProductPrice";
import { DefaultDescription } from "../ui/DefaultDescription";
import { ButtonModern } from "../ui/ButtonModern";
import { theme } from "@/src/theme";
import MyScreenContainer from "./MyScreenContainer";
import { useProductSingleFromId } from "@/src/hooks/useClienteQueries";
import { SectionContainer } from "./SectionContainer";
import { Router, useRouter } from "expo-router";

interface InfoProductBottomSheetProps {
    idProduct: number | string,
    closeSheet: () => void,
}

export function InfoProductBottomSheet({
    idProduct,
    closeSheet,
}: InfoProductBottomSheetProps) {

    const {
        data,
        isLoading,
    } = useProductSingleFromId(
        idProduct
    );

    const router = useRouter();

    return (
        <BottomSheetView>
                <MyScreenContainer
                    style={{
                        alignItems: "stretch",
                    }}
                >   
                <SectionContainer 
                    style={{
                        paddingTop: 0,
                        gap: theme.gap.xs
                    }}
                    title={data?.nome_prod || ""}
                    isLoading={isLoading}
                >
                            {/* <Text style={styles.textTitle}>
                                {data?.nome_prod}
                            </Text> */}
                        <TextProductPrice
                            size="L"                
                            price={data?.preco || ""}
                            isLoading={isLoading}
                        />

                        <View
                            style={{
                                flexDirection: "row"
                            }}
                        >
                            <DefaultDescription
                                size="S"
                                text1={`Venido por: ${data?.nomeestabelecimento}`}
                                text2={`Estoque: ${data?.quantidade} un`}
                                isLoading={isLoading}
                            />

                                <ButtonModern
                                    placeholder="Ver Fornecedor"
                                    size="S"
                                    variant="ghost"
                                    onPress={() => {
                                        closeSheet();
                                        router.push(`/(cliente)/fornecedores/${data?.id_fornecedor}`);
                                    }}
                                    isLoading={isLoading}
                                />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                gap: theme.gap.md,
                            }}
                        >
                            <ButtonModern
                                size="M"
                                placeholder="Adicionar "
                                isLoading={isLoading}
                            />
                            <ButtonModern
                                style={{flex: 1}}
                                size="M"
                                placeholder="Adicionar ao Pedito"
                                isLoading={isLoading}
                            />
                        </View>
                </SectionContainer>
            </MyScreenContainer>
        </BottomSheetView>
    );
}

