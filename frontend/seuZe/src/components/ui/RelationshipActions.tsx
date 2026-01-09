import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { StyleSheet, View } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "./ButtonModern";
import { theme } from "@/src/theme";

type RelationshipActionsProps = {
    type: RelationshipStatusType
}

export function RelationshipActions({type}: RelationshipActionsProps) {
    return (
        <View 
            style={styles.container}
        >
            {type === "ACCEPTED" && (
                <>
                    <ButtonModern placeholder="Fazer Pedido" size="M"/>
                    <ButtonModern placeholder="Cancelar" size="M" variant="outline"/>
                </>
            )}

            {type === "NONE" && (
                <ButtonModern placeholder="Solicitar Parceria" size="M" variant="outline"/>
            )}

            {type === "RECEIVED" && (
                <>
                    <ButtonModern placeholder="Aceitar" iconName="check" size="M"/>
                    <ButtonModern placeholder="Recusar" iconName="x" size="M" variant="outline"/>
                </>
            )}
            {type === "SENT"  && (
                <ButtonModern placeholder="Aguardando Aprovação" size="M" variant="disabled"/>
            )}
        </View>
    );
}

export function RelationshipActionsSkeleton() {
    return (
        <View style={{
            flex: 1,
            gap: theme.gap.sm,
            flexDirection: "row"
        }}
        >
            <ButtonModernSkeleton size="M"/>
            <ButtonModernSkeleton size="M"/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: theme.gap.sm
    },
});