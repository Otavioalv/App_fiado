import { ShoppingStatusType } from "@/src/types/responseServiceTypes";
import { View } from "react-native";
import { ChipBadge } from "./ChipBadge";


type StatusShoppingProps = {status: ShoppingStatusType;}

export function StatusShopping({
    status
}:StatusShoppingProps) {

    return (
        <View 
            style={{
                // flex: 1, 
                alignItems: "flex-start",

                // backgroundColor: "red"
            }}
        >
            {status === "ANALYSIS" && (
                <ChipBadge
                    text="Em Análise"
                    variant="outline"
                />
            )}

            {status === "CANCELED" && (
                <ChipBadge
                    text="Cancelado"
                    variant="outline"
                />
            )}

            {status === "PAID" && (
                <ChipBadge
                    text="Quitado"
                    variant="outline"
                />
            )}

            {status === "PENDING" && (
                <ChipBadge
                    text="Pendente"
                    variant="outline"
                />
            )}

            {status === "REFUSED" && (
                <ChipBadge
                    text="Recusado"
                    variant="outline"
                />  
            )}

            {status === "WAIT_REMOVE" && (
                <ChipBadge
                    text="Em Análise"
                    variant="outline"
                />  
            )}
            {/* <ChipBadge
                text="Aguardando Retirada"
                variant="primary"
            />
            <ChipBadge
                text="Aguardando Retirada"
                variant="outline"
            />

            <ChipBadge
                text="Aguardando Retirada"
                variant="disabled"
            /> */}
        </View>
    );
}
