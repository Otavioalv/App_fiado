import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { DefaultCard } from "../ui/DefaultCard";
import { memo } from "react";
import { RelationshipActionProduct } from "../ui/RelationshipActionProduct";
import { ButtonModernSkeleton } from "../ui/ButtonModern";
import { ProductDescription, ProductDescriptionProps, ProductDescriptionSkeleton } from "../ui/ProductDescription";
import { PressableCard } from "../ui/PressableCard";
import { PressableProps } from "react-native";
import { OnPressActionFunctionType } from "../ui/RelationshipActions";

export interface ProductCardProps extends ProductDescriptionProps, PressableProps{
    relationshipType: RelationshipStatusType, 
    idUser: string | number,
    onPressActionFunction?: OnPressActionFunctionType,
    onPressAccepted?: (id: string | number) => void,
};

export function ProductCard({
    relationshipType,
    apelido,
    marketName,
    nome,
    price,
    prodName,
    idUser, 
    onPressActionFunction,
    onPressAccepted,
    ...pressableProps
}: ProductCardProps) {
    return (
        <PressableCard
            {...pressableProps}
        >
            <ProductDescription
                marketName={marketName}
                nome={nome}
                price={price}
                prodName={prodName}
                apelido={apelido}
            />
            <RelationshipActionProduct 
                type={relationshipType}
                idUser={idUser}
                onPressAction={onPressActionFunction}
                onPressAccepted={onPressAccepted}
            />
        </PressableCard>
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
