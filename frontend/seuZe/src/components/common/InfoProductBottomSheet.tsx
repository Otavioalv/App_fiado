import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View } from "react-native";
import { TextProductPrice } from "../ui/TextProductPrice";
import { DefaultDescription } from "../ui/DefaultDescription";
import { ButtonModern } from "../ui/ButtonModern";
import { theme } from "@/src/theme";
import MyScreenContainer from "./MyScreenContainer";
import { useProductSingleFromId } from "@/src/hooks/useClienteQueries";
import { SectionContainer } from "./SectionContainer";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Stepper } from "./Stepper";

interface InfoProductBottomSheetProps {
    idProduct: number | string,
}

export function InfoProductBottomSheet({
    idProduct,
}: InfoProductBottomSheetProps) {
    const router = useRouter();
    
    const {
        data,
        isLoading,
    } = useProductSingleFromId(
        idProduct
    );


    // Temporario lista de compras
    const [productQnt, setProductQnt] = useState<number>(1);



    const isActivate: boolean = data?.relationship_status === "ACCEPTED";
    return (
        <BottomSheetScrollView>
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
                                text1={`Vendido por: ${data?.nomeestabelecimento}`}
                                text2={`Estoque: ${data?.quantidade} un.`}
                                isLoading={isLoading}
                            />

                                <ButtonModern
                                    placeholder="Ver Fornecedor"
                                    size="S"
                                    variant="ghost"
                                    onPress={() => {
                                        // closeSheet();
                                        router.push(`/fornecedores/${data?.id_fornecedor}`);
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
                            <Stepper
                                quantity={productQnt}
                                setQuantity={setProductQnt}
                                isLoading={isLoading}
                                isInteractive={isActivate}
                                variant={isActivate ? "primary" : "disabled"}
                            />

                            <ButtonModern
                                style={{flex: 1}}
                                size="M"
                                placeholder="Adicionar ao Carrinho"
                                isLoading={isLoading}
                                variant={isActivate ? "primary" : "disabled"}
                            />
                        </View>
                </SectionContainer>
            </MyScreenContainer>
        </BottomSheetScrollView>
    );
}
