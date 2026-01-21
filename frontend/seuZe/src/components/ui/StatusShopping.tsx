import { ShoppingStatusType } from "@/src/types/responseServiceTypes";
import { Animated, StyleSheet, View } from "react-native";
import { ChipBadge, ChipBadgeSkeleton } from "./ChipBadge";
import { theme } from "@/src/theme";


export interface StatusShoppingProps {
    status: ShoppingStatusType,
    paid: boolean
}

export function StatusShopping({
    status,
    paid
}:StatusShoppingProps) {

    return (
        <View
            style={styles.container}
        >
        {/* // <View 
        //     style={{
        //         // flex: 1, 
        //         // alignItems: "flex-start",

        //         // backgroundColor: "red"
        //     }}
        // > */}

            {status !== "PAID" && (<>
                {paid ? (
                    <ChipBadge
                        text="Quitado"
                        variant="primary"
                    />
                ) : (
                    <ChipBadge
                        text="Pendente"
                        variant="outline"
                    />
                )}
            </>)}

            {status === "ANALYSIS" && (
                <ChipBadge
                    text="Em Análise"
                    variant="outline"
                />
            )}

            {status === "CANCELED" && (
                <ChipBadge
                    text="Cancelado"
                    variant="disabled"
                />
            )}

            {status === "PAID" && (
                <ChipBadge
                    text="Quitado"
                    variant="primary"
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
                    variant="disabled"
                />  
            )}

            {status === "WAIT_REMOVE" && (
                <ChipBadge
                    text="Aguardando Retirada"
                    variant="outline"
                />  
            )}
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