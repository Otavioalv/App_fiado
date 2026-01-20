import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { DefaultCard } from "../ui/DefaultCard";
import { memo } from "react";
import { RelationshipActionProduct } from "../ui/RelationshipActionProduct";
import { ButtonModernSkeleton } from "../ui/ButtonModern";
import { ProductDescription, ProductDescriptionProps, ProductDescriptionSkeleton } from "../ui/ProductDescription";

export interface ProductCardProps extends ProductDescriptionProps{
    relationshipType: RelationshipStatusType
};

export function ProductCard({
    relationshipType,
    apelido,
    marketName,
    nome,
    price,
    prodName
}: ProductCardProps) {
    return (
        <DefaultCard>
            <ProductDescription
                marketName={marketName}
                nome={nome}
                price={price}
                prodName={prodName}
                apelido={apelido}
            />
            <RelationshipActionProduct 
                type={relationshipType}
            />

        </DefaultCard>
    );
}


export function ProductCardSkeleton() {
    return (
        <DefaultCard>
            <ProductDescriptionSkeleton/>
            <ButtonModernSkeleton size="M"/>
        </DefaultCard>
    )
}

export const MemoProductCardSkeleton = memo(ProductCardSkeleton);
export const MemoProductCard = memo(ProductCard);
