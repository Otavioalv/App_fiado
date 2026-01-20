import { ShoppingStatusType } from "@/src/types/responseServiceTypes";
import { DefaultCard } from "../ui/DefaultCard";
import { ProductDescription, ProductDescriptionProps } from "../ui/ProductDescription";
import { StatusShopping } from "../ui/StatusShopping";

export interface ShoppingCardProps extends ProductDescriptionProps {
    status: ShoppingStatusType,
}

export function ShoppingCard({
    marketName,
    nome,
    price,
    prodName,
    apelido,
    status
}: ShoppingCardProps) {

    console.log(status);
    return (
        <DefaultCard>
            <ProductDescription
                marketName={marketName}
                nome={nome}
                price={price}
                prodName={prodName}
                apelido={apelido}
            />
        
            <StatusShopping
                status={status}
            />

        </DefaultCard>
    );
}
