import { memo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { PressableCard } from "../ui/PressableCard";
import { TextProductPrice, TextProductPriceSkeleton } from "../ui/TextProductPrice";
import { theme } from "@/src/theme";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/src/utils";
import { ptBR } from "date-fns/locale";
import { DefaultCard } from "../ui/DefaultCard";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";

export interface ResumeCartCardProps {
    prodName: string,
    price: number,
    nomeEstabelecimento:string,
    quanity: number, 
    term: string,
    isLoading?: boolean;
}

export function ResumeCartCard({
    prodName,
    price,
    nomeEstabelecimento,
    quanity,
    term,
    isLoading = false,
}: ResumeCartCardProps) {
    if(isLoading) return <ResumeCartCardSkeleton/>;

    const parsedDate = parseISO(term);
    return (
        <PressableCard>
            <View style={styles.topContainer}>
                <Text style={styles.textProductName}>
                    {prodName}
                </Text>
                <TextProductPrice
                    price={price}
                />
            </View>
            <Text style={styles.textEstabelecimento}>
                Estabelecimento: {nomeEstabelecimento}
            </Text>
            <Text style={styles.quanity}>
                Quantidade: {quanity} un. X {formatCurrency(price)};
            </Text>

            <Text style={styles.term}>
                Prazo para pagamento: {format(parsedDate, "dd/MM/yyyy", { locale: ptBR })}
            </Text>
        </PressableCard>
    );
}
export const MemoResumeCartCart = memo(ResumeCartCard);


export function ResumeCartCardSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();
    return(
        <DefaultCard>
            <View style={styles.topContainer}>
                <Animated.View style={[styles.textProductNameSkeleton, anmOpacity]}/>
                <TextProductPriceSkeleton/>
            </View>
            <Animated.View style={[styles.textSkeleton, anmOpacity]}/>
            <Animated.View style={[styles.textSkeleton, anmOpacity]}/>
            <Animated.View style={[styles.textSkeleton, anmOpacity]}/>
        </DefaultCard>
    )
}
export const MemoResumeCartCartSkeleton = memo(ResumeCartCardSkeleton);

const styles = StyleSheet.create({
    topContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    }, 
    textProductName: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold",
    },  
    textEstabelecimento: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    quanity: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    term: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize,
    },
    textProductNameSkeleton: {
        width: 100,
        height: 15,
        borderRadius: 1000,
    },
    textSkeleton: {
        width: 200,
        height: 10,
        borderRadius: 1000,
    }
});
