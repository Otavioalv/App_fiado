import { DefaultCard } from "../ui/DefaultCard";
import { memo } from "react";
import { PressableCard } from "../ui/PressableCard";
import { GestureResponderEvent, PressableProps } from "react-native";
import { ProductDescriptionFornecedor, ProductDescriptionFornecedorProps, ProductDescriptionFornecedorSkeleton } from "../ui/ProductDescriptionFornecedor";
import { ButtonModern } from "../ui/ButtonModern";



export interface ProductCardFornecedorProps extends PressableProps, ProductDescriptionFornecedorProps{
    idProduct: string | number,
    onPressEditFunction?: ((event: GestureResponderEvent) => void) | null | undefined,
}

export function ProductCardFornecedor({
    price,
    prodName,
    quantity,
    isLoading,
    onPressEditFunction,
    ...pressableProps
}: ProductCardFornecedorProps) {
    return (
        <PressableCard
            {...pressableProps}
        >
            <ProductDescriptionFornecedor
                price={price}
                prodName={prodName}
                quantity={quantity}
                isLoading={isLoading}
            />
            <ButtonModern
                onPress={onPressEditFunction}
                placeholder="Editar"
                iconName="edit"
                size="M"
            />
        </PressableCard>
    );
}


export function ProductCardFornecedorSkeleton() {
    return (
        <DefaultCard>
            <ProductDescriptionFornecedorSkeleton/>
        </DefaultCard>
    )
}

export const MemoProductCardFornecedorSkeleton = memo(ProductCardFornecedorSkeleton);
export const MemoProductCardFornecedor = memo(ProductCardFornecedor);
