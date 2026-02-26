import { Animated, GestureResponderEvent, StyleSheet, Text, View } from "react-native";
import { SpacingScreenContainer } from "../ui/SpacingScreenContainer";
import { TextProductPrice, TextProductPriceSkeleton } from "../ui/TextProductPrice";
import { ChipBadge, ChipBadgeSkeleton } from "../ui/ChipBadge";
import { ButtonModern, ButtonModernSkeleton } from "../ui/ButtonModern";
import { theme } from "@/src/theme";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { Feather } from "@expo/vector-icons";


interface BottomShoppingCartProps {
    price: number,
    totalItems: number, 
    isLoading?: boolean, 
    isNext?: boolean,
    onPressSave?: ((event: GestureResponderEvent) => void) | null | undefined,
    onPressNext?:((event: GestureResponderEvent) => void) | null | undefined,
    disableBtn?: boolean,
};


interface BtnVariantItemType {  
    placeholder: string, 
    iconName: keyof typeof Feather.glyphMap,
    onPress: ((event: GestureResponderEvent) => void) | null | undefined,
}

interface BtnVariantListType {
    editable: BtnVariantItemType,
    nextStep: BtnVariantItemType,
}

export function BottomShoppingCart({
    onPressSave, 
    onPressNext,
    price, 
    totalItems,
    isNext = true, 
    isLoading = false,
    disableBtn = false,
}: BottomShoppingCartProps) {
    if(isLoading) return <BottomShoppingCartSkeleton/>;

    const totalText = `${totalItems} itens`;


    const btnVariant:BtnVariantListType = {
        editable: {
            placeholder: "Salvar alterações",
            iconName: "upload-cloud",
            onPress: onPressSave,
        },
        nextStep: {
            placeholder: "Proximo Passo",
            iconName: "shopping-cart",
            onPress: onPressNext,
        }
    };

    const btnCurrent: BtnVariantItemType = isNext ? btnVariant.nextStep : btnVariant.editable;

    return (
        <SpacingScreenContainer style={styles.container}>
            <View style={styles.infoTop}>
                {/* <View style={styles.infoBetwen}>
                    <Text style={styles.textTotalInfo}>
                        TOTAL DO PEDIDO
                    </Text>

                    <TextProductPrice
                        price={price}
                        size="L"
                    />
                </View>  */}
                {/* <ChipBadge
                    text={totalText}
                    variant="outline"
                /> */}
            </View>

            <ButtonModern
                // placeholder="Proximo Passo"
                placeholder={btnCurrent.placeholder}
                iconName={btnCurrent.iconName}
                size="L"
                variant="primary"
                onPress={btnCurrent.onPress}
                disabled={disableBtn}
            />
        </SpacingScreenContainer>
    );
}


export function BottomShoppingCartSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <SpacingScreenContainer style={styles.container}>
            <View style={styles.infoTop}>
                <View style={styles.infoBetwen}>
                    <Animated.View style={[anmOpacity, styles.textTotalInfoSkeleton]}/>
                    <ChipBadgeSkeleton/>
                </View>

                <TextProductPriceSkeleton/>
            </View>

            <ButtonModernSkeleton
                size="L"
            />

        </SpacingScreenContainer>
    );
}


const styles = StyleSheet.create({
    infoTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    container: {
        gap: theme.gap.sm,
        borderTopColor: theme.colors.pseudoLightGray,
        borderTopWidth: 1,
    },
    textTotalInfo: {
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.textNeutral900,
    },
    infoBetwen: {
        gap: theme.gap.xs
    },
    textTotalInfoSkeleton: {
        width: 105,
        height: 15,
        borderRadius: 1000,
    }
});
