import { DefaultCard } from "../ui/DefaultCard";
import { ProductDescription, ProductDescriptionProps, ProductDescriptionSkeleton } from "../ui/ProductDescription";
import { StatusShopping, StatusShoppingProps, StatusShoppingSkeleton } from "../ui/StatusShopping";
import { memo } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { transformDateToUI } from "@/src/utils";

export interface ShoppingCardProps extends ProductDescriptionProps, StatusShoppingProps {
    prazo: Date,
    criadoEm: Date
}

export function ShoppingCard({
    marketName,
    nome,
    price,
    prodName,
    apelido,
    shoppingStatus,
    prazo,
    paymentStatus,
    criadoEm
}: ShoppingCardProps) {
    const prazoText:string = new Date() < prazo ? "Venceu: " : "Vence: ";

    // console.log(new Date(prazo), prazo);
    
    const prazoTransform: string = transformDateToUI(prazo)
    const criadoEmTransform: string = transformDateToUI(criadoEm);

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
                    shoppingStatus={shoppingStatus}
                    paymentStatus={paymentStatus}
                />
                
                <View style={styles.dateContainer}>
                    {prazo && (
                        <Text numberOfLines={1}>
                            {prazoText} {prazoTransform}
                        </Text>
                        
                    )}
                    {criadoEm && (
                        <Text numberOfLines={1}>
                            Criado em: {criadoEmTransform}
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
