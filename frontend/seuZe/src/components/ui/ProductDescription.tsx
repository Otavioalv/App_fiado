import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { Animated, StyleSheet, Text, View } from "react-native";

export interface ProductDescriptionProps {
    prodName: string,
    price: string,
    nome: string,
    apelido?: string,
    marketName: string
}

export function ProductDescription({
    prodName,
    price,
    nome,
    apelido,
    marketName
}: ProductDescriptionProps) {
    return (
        <View style={styles.container}>
            
            <View style={[styles.textContainer, styles.textContainerBase]}>
                <Text style={[styles.titleText, styles.titleBase]} numberOfLines={1}>
                    {prodName}
                </Text>
                <Text style={[styles.titleText, styles.priceText]} numberOfLines={1}>
                    R$ {price}
                </Text>
            </View>


            <View style={[styles.textContainerBase]}>
                <Text numberOfLines={1}>
                    <Text style={styles.subTitleText} numberOfLines={1}>
                        {"Estabelecimento:  "}
                    </Text>
                    <Text style={styles.subTitleValueText} numberOfLines={1}>
                        {marketName}
                    </Text>
                </Text>

                <Text numberOfLines={1}>
                    <Text style={styles.subTitleText} numberOfLines={1}>
                        {"Resp: "}
                    </Text>
                    <Text style={styles.subTitleValueText} numberOfLines={1}>
                        {nome}
                        {apelido && ` - (${apelido})`}
                    </Text>
                </Text>

            </View>

        </View>
    );
}



export function ProductDescriptionSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();
    
    return (
        <View style={styles.container}>
            <View style={styleSkeleton.headContainer}>
                <Animated.View style={[anmOpacity, styleSkeleton.titleTextBase, styleSkeleton.titleText]}/>
                <Animated.View style={[anmOpacity, styleSkeleton.titleTextBase, styleSkeleton.price]}/>
            </View>

            <View style={styleSkeleton.bottomContainer}>
                <Animated.View style={[anmOpacity, styleSkeleton.textBottom]}/>
                <Animated.View style={[anmOpacity, styleSkeleton.textBottom]}/>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        gap: theme.gap.sm
    },

    textContainerBase: {
        gap: theme.gap.xs
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    

    titleText: {
        fontWeight: "bold",
        fontSize: theme.typography.textLG.fontSize,
    },
    titleBase: {
        color: theme.colors.textNeutral900,
        maxWidth: "70%"
    },
    

    priceText: {
        color: theme.colors.orange,
        maxWidth: "30%"
    },

    
    subTitleText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "500"
    },
    subTitleValueText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,  
    }
});

const styleSkeleton = StyleSheet.create({
    headContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    bottomContainer: {
        gap: theme.gap.sm
    },
    titleText: {
        width: 180
    }, 
    price: {
        width: 100
    },
    titleTextBase: {
        borderRadius: 1000,
        height: 30,
    },
    textBottom: {
        borderRadius: 1000,
        height: 15,
        width: 250
    }
});
