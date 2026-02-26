import { RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { StyleSheet, View } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "./ButtonModern";
import { theme } from "@/src/theme";
import { OnPressActionFunctionType, RelationshipActionsSkeleton } from "./RelationshipActions";

type RelationshipActionProductProps = {
    type: RelationshipStatusType,
    idUser: string | number, 
    isLoading?: boolean, 
    onPressAction?: OnPressActionFunctionType,
    onPressAccepted?: () => void,
}

export function RelationshipActionProduct({
    type,
    isLoading,
    idUser,
    onPressAccepted,
    onPressAction,
}: RelationshipActionProductProps) {
    if(isLoading) return <RelationshipActionsSkeleton/>;
    
    const handleOptionalButtonProps: OnPressActionFunctionType = onPressAction ? onPressAction : ({id, newStatus}) => {};
    const handleOnPressAccepted = onPressAccepted ? onPressAccepted : () => {};

    return (
        <View 
            style={styles.container}
        >
            {type === "ACCEPTED" && (
                <>
                {/* MUDAR PARA BOTAO QUE MUDA AO APERTAR E PEDE QUANTIDADE */}
                    <ButtonModern 
                        placeholder="Adicionar ao carirnho" 
                        size="M" 
                        style={{flex: 1}}
                        onPress={handleOnPressAccepted}
                    />
                </>
            )}

            {type === "NONE" && (
                <ButtonModern 
                    placeholder="Solicitar Parceria" 
                    size="M" 
                    variant="outline" 
                    style={{flex: 1}}
                    onPress={() => handleOptionalButtonProps({id: idUser, newStatus: "SENT"})}
                />
            )}

            {type === "RECEIVED" && (
                <>
                    <ButtonModern 
                        placeholder="Aceitar" 
                        iconName="check" 
                        size="M" 
                        style={{flex: 1}}
                        onPress={() => handleOptionalButtonProps({id: idUser, newStatus: "ACCEPTED"})}
                    />
                    <ButtonModern 
                        placeholder="Recusar" 
                        iconName="x" 
                        size="M" 
                        variant="outline" 
                        style={{flex: 1}}
                        onPress={() => handleOptionalButtonProps({id: idUser, newStatus: "NONE"})}
                    />
                </>
            )}
            {type === "SENT"  && (
                <ButtonModern 
                    placeholder="Aguardando Aprovação" 
                    size="M" 
                    variant="disabled" 
                    style={{flex: 1}}
                />
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
