import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { DefaultCard } from "../ui/DefaultCard";
import { StyleSheet, Text, View } from "react-native";
import { memo } from "react";
import { RelationshipActionProduct } from "../ui/RelationshipActionProduct";
import { theme } from "@/src/theme";

export interface ProductCardProps {
    prodName: string, 
    marketName: string,
    fornecedorName: string,
    price: string, // number 
    relationshipType: RelationshipStatusType
};

export function ProductCard({
    fornecedorName, 
    marketName, 
    price, 
    prodName, 
    relationshipType
}: ProductCardProps) {
    return (
        <DefaultCard>
            
            <View style={[styles.textContainer, styles.textContainerBase]}>
                <Text style={[styles.titleText, styles.titleBase]}>
                    {prodName}
                </Text>
                <Text style={[styles.priceText, styles.titleText]}>
                    R$ {price}
                </Text>
            </View>


            <View style={[styles.textContainerBase]}>
                <Text>
                    <Text style={styles.subTitleText}>
                        {"Estabelecimento:  "}
                    </Text>
                    <Text style={styles.subTitleValueText}>
                        {marketName}
                    </Text>
                </Text>

                <Text>
                    <Text style={styles.subTitleText}>
                        {"Resp: "}
                    </Text>
                    <Text style={styles.subTitleValueText}>
                        {fornecedorName}
                    </Text>
                </Text>

            </View>

            <RelationshipActionProduct 
                type={relationshipType}
            />

        </DefaultCard>
    );
}

export const MemoProductCard = memo(ProductCard);

const styles = StyleSheet.create({
    textContainerBase: {
        gap: theme.gap.xs
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    

    titleText: {
        fontWeight: "bold",
        fontSize: theme.typography.textLG.fontSize,
    },
    titleBase: {
        color: theme.colors.textNeutral900
    },
    

    priceText: {
        color: theme.colors.orange
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