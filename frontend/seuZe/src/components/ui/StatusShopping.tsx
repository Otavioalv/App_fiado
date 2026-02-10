import { PaymentStatusType, ShoppingStatusType } from "@/src/types/responseServiceTypes";
import { StyleSheet, View } from "react-native";
import { ChipBadge, ChipBadgeProps, ChipBadgeSkeleton } from "./ChipBadge";
import { theme } from "@/src/theme";


export interface StatusShoppingProps {
    shoppingStatus: ShoppingStatusType,
    paymentStatus: PaymentStatusType,
}


const shoppingStatusSet:Record<ShoppingStatusType, ChipBadgeProps> = {
    ANALYSIS: {
        text:"Em Análise",
        variant:"outline"
    },
    CANCELED: {
        text:"Cancelado",
        variant:"disabled"
    },
    REFUSED: {
        text:"Recusado",
        variant:"disabled",
    },
    REMOVED: {
        text: "Retirado",
        variant: "primary",
    },
    WAIT_REMOVE: {
        text:"Aguardando Retirada",
        variant:"outline",
    }, 
    LOADING: {
        text: "",
        variant: "disabled"
    }
}

const paymentStatusSet: Record<PaymentStatusType, ChipBadgeProps> = {
    PAID: {
        text: "Quitado",
        variant: "primary"
    },
    PENDING: {
        text: "Pendente",
        variant: "outline"
    }, 
    LOADING: {
        text: "",
        variant: "disabled"
    }
}
// workana

export function StatusShopping({
    shoppingStatus,
    paymentStatus,
}:StatusShoppingProps) {
    const shoppingStatusValue = shoppingStatusSet[shoppingStatus];
    const paymentStatusValue = paymentStatusSet[paymentStatus];

    return (
        <View
            style={styles.container}
        >   
            <ChipBadge
                text={paymentStatusValue.text}
                variant={paymentStatusValue.variant}
            />

            <ChipBadge
                text={shoppingStatusValue.text}
                variant={shoppingStatusValue.variant}
            />
            
        </View>
    );
}


export function StatusShoppingSkeleton() {
    return (
        <ChipBadgeSkeleton/>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row", 
        gap: theme.gap.sm
    }
});