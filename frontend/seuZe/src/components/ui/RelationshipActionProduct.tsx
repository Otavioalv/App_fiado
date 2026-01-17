import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { StyleSheet, View } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "./ButtonModern";
import { theme } from "@/src/theme";

type RelationshipActionProductProps = {
    type: RelationshipStatusType
}

export function RelationshipActionProduct({type}: RelationshipActionProductProps) {
    return (
        <View 
            style={styles.container}
        >
            {type === "ACCEPTED" && (
                <>
                    <ButtonModern placeholder="Comprar" size="M" style={{flex: 1}}/>
                </>
            )}

            {type === "NONE" && (
                <ButtonModern placeholder="Solicitar Parceria" size="M" variant="outline" style={{flex: 1}}/>
            )}

            {type === "RECEIVED" && (
                <>
                    <ButtonModern placeholder="Aceitar" iconName="check" size="M" style={{flex: 1}}/>
                    <ButtonModern placeholder="Recusar" iconName="x" size="M" variant="outline" style={{flex: 1}}/>
                </>
            )}
            {type === "SENT"  && (
                <ButtonModern placeholder="Aguardando Aprovação" size="M" variant="disabled" style={{flex: 1}}/>
            )}
        </View>
    );
}

export function RelationshipActionProductSkeleton() {
    return (
        <View style={{
            flex: 1,
            gap: theme.gap.sm,
            flexDirection: "row"
        }}
        >
            <ButtonModernSkeleton size="M" style={{flex: 1}}/>
            <ButtonModernSkeleton size="M" style={{flex: 1}}/>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        gap: theme.gap.sm,
        // backgroundColor: "red"
    },
});
