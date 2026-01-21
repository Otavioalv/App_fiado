import { DefaultCard } from "../ui/DefaultCard";
import { ProductDescription, ProductDescriptionProps, ProductDescriptionSkeleton } from "../ui/ProductDescription";
import { StatusShopping, StatusShoppingProps, StatusShoppingSkeleton } from "../ui/StatusShopping";
import { memo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";

export interface ShoppingCardProps extends ProductDescriptionProps, StatusShoppingProps {
    prazo?: string,
    criadoEm?: string
}

export function ShoppingCard({
    marketName,
    nome,
    price,
    prodName,
    apelido,
    status,
    prazo,
    paid,
    criadoEm
}: ShoppingCardProps) {

    // console.log(status);
    return (
        <DefaultCard>
            <ProductDescription
                marketName={marketName}
                nome={nome}
                price={price}
                prodName={prodName}
                apelido={apelido}
            />

            <View
                style={styles.containerBottom}
            >
                <StatusShopping
                    status={status}
                    paid={paid}
                />
                
                <View style={styles.dateContainer}>
                    {prazo && (
                        <Text numberOfLines={1}>
                            Vence: {prazo}
                        </Text>
                        
                    )}
                    {criadoEm && (
                        <Text numberOfLines={1}>
                            Criado em: {criadoEm}
                        </Text>
                    )}
                </View>

            </View>

        </DefaultCard>
    );
}


export function ShoppingCardSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <DefaultCard>
            <ProductDescriptionSkeleton/>

            <View style={styles.containerBottom}>
                <StatusShoppingSkeleton/>
                
                <View style={[styles.dateContainer, {gap: 2}]}>
                    <Animated.View style={[anmOpacity, styles.dateSkeleton]}/>
                    <Animated.View style={[anmOpacity, styles.dateSkeleton]}/>
                </View>
            </View>
        </DefaultCard>
    );
}

export const MemoShoppingCard = memo(ShoppingCard);
export const MemoShoppingCardSkeleton = memo(ShoppingCardSkeleton);


const styles = StyleSheet.create({
    containerBottom: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    dateSkeleton: {
        width: 75,
        height: 15,
        borderRadius: 1000
    },
    dateContainer: {
        flexDirection: "column", 
        alignItems: "flex-end"
    }
});
