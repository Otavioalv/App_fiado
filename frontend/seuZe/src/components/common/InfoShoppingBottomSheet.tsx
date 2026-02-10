import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet, Animated} from "react-native";
import MyScreenContainer from "./MyScreenContainer";
import { ProductDescription, ProductDescriptionSkeleton } from "../ui/ProductDescription";
import { StatusShopping, StatusShoppingSkeleton } from "../ui/StatusShopping";
import { useShoppingListFromid } from "@/src/hooks/useClienteQueries";
import { theme } from "@/src/theme";
import { formatCurrency, transformDateToUI } from "@/src/utils";
import { ButtonModern, ButtonModernSkeleton } from "../ui/ButtonModern";
import { useRouter } from "expo-router";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";

interface InfoShoppingBottomSheetProps {
    idShopping: number | string;
}


export function InfoShoppingBottomSheet({
    idShopping,
}: InfoShoppingBottomSheetProps){

    const router = useRouter();
    
    const {
        data: dataShopping,
        isLoading: isLoadingShopping,
    } = useShoppingListFromid(idShopping);

    if(isLoadingShopping) return <InfoShoppingBottomSheetSkeleton/>


    const prazoStatus =
        !dataShopping?.prazo
            ? ""
            : new Date() > new Date(dataShopping.prazo)
            ? "Vencido: "
            : "No Prazo: ";

    
    
    const prazoTransform =
        dataShopping?.prazo
            ? transformDateToUI(dataShopping.prazo)
            : "";

    const criadoEmTransform =
        dataShopping?.created_at
            ? transformDateToUI(dataShopping.created_at)
            : "";


    const totalPrice:number = 
        dataShopping?.valor_unit && dataShopping.quantidade 
        ? Number(dataShopping.valor_unit) * dataShopping.quantidade
        : 0
        

    return (
        <BottomSheetScrollView>
            <MyScreenContainer
                style={styles.containar}
            >
                <ProductDescription
                    marketName={dataShopping?.nomeestabelecimento || ""}
                    nome={dataShopping?.nome_user || ""}
                    price={totalPrice}
                    prodName={dataShopping?.nome_produto || ""}
                    apelido={dataShopping?.apelido_user}
                    isLoading={isLoadingShopping}
                />

                <View style={styles.infoPrice}>
                    <Text style={styles.infoUnt}>
                        {dataShopping?.quantidade} un. X {formatCurrency(dataShopping?.valor_unit || "")}
                    </Text>

                    <ButtonModern
                        placeholder="Ver Fornecedor"
                        size="S"
                        variant="ghost"
                        onPress={() => router.push(`/fornecedores/${dataShopping?.fk_fornecedor_id}`)}
                    />
                </View>

                <View
                    style={styles.containerBottom}
                >
                    <StatusShopping
                        shoppingStatus={dataShopping?.shopping_status || "LOADING"}
                        paymentStatus={dataShopping?.payment_status || "LOADING"}
                    />
                    
                    <View style={styles.dateContainer}>
                        {dataShopping?.prazo && (
                            <Text numberOfLines={1}>
                                {prazoStatus} {prazoTransform}
                            </Text>
                            
                        )}
                        {dataShopping?.created_at && (
                            <Text numberOfLines={1}>
                                Criado em: {criadoEmTransform}
                            </Text>
                        )}
                    </View>
    
                </View> 
                
            </MyScreenContainer>
        </BottomSheetScrollView>
    );
}


export function InfoShoppingBottomSheetSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <BottomSheetScrollView>
            <MyScreenContainer
                style={styles.containar}
            >
                <ProductDescriptionSkeleton/>
                <View style={styles.infoPrice}>
                    <Animated.View style={[anmOpacity, styles.dateSkeleton]}/>
                    <ButtonModernSkeleton size="S"/>
                </View>
                <View style={styles.containerBottom}>
                    <StatusShoppingSkeleton/>
                    <View style={[styles.dateContainer, {gap: 2}]}>
                        <Animated.View style={[anmOpacity, styles.dateSkeleton]}/>
                        <Animated.View style={[anmOpacity, styles.dateSkeleton]}/>
                    </View>
                </View>
            </MyScreenContainer>
        </BottomSheetScrollView>
    );
}


const styles = StyleSheet.create({
    containar: {
        alignItems: "stretch",
        gap: theme.gap.sm,
    },
    containerBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    dateContainer: {
        flexDirection: "column", 
        alignItems: "flex-end"
    },
    infoUnt: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    infoPrice: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    dateSkeleton: {
        width: 75,
        height: 15,
        borderRadius: 1000
    },
});