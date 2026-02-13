import { ActionRelationShipStatusType, RelationshipStatusType } from "@/src/types/responseServiceTypes";
import { StyleSheet, View } from "react-native";
import { ButtonModern, ButtonModernSkeleton } from "./ButtonModern";
import { theme } from "@/src/theme";


export interface OnPressActionParamsType {
    id: number | string,
    newStatus: ActionRelationShipStatusType
};

export type OnPressActionFunctionType = ({
    id, 
    newStatus
}:OnPressActionParamsType) => void;

interface RelationshipActionsProps {
    type: RelationshipStatusType,
    idUser: string | number,
    isLoading?: boolean,
    onPressAction?: OnPressActionFunctionType,
    onPressAccepted?: (id: number | string) => void,
}

export function RelationshipActions({
    type,
    idUser,
    isLoading,
    onPressAction,
    onPressAccepted,
}: RelationshipActionsProps) {
;
    const handleOptionalButtonProps: OnPressActionFunctionType = onPressAction ? onPressAction : ({id, newStatus}) => {};
    const handleOnPressAccepted = onPressAccepted ? onPressAccepted : (id: number | string) => {};

    return (
        <View 
            style={styles.container}
        >
            {isLoading ? (
                <RelationshipActionsSkeleton/>
            ) : (<>
                {type === "ACCEPTED" && (
                    <>
                        <ButtonModern 
                            placeholder="Fazer Pedido" 
                            size="M" 
                            style={{flex: 1}} 
                            onPress={() => {handleOnPressAccepted(idUser)}}
                        />
                        <ButtonModern 
                            placeholder="Cancelar" 
                            size="M" 
                            variant="outline" 
                            style={{flex: 1}} 
                            onPress={() => handleOptionalButtonProps({id: idUser, newStatus: "NONE"})}
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
                        disabled={true}
                        // onPress={() => {console.log("Esta aguardando, entao n tem ação nesse botao: ", idUser)}}
                    />
                )}
            </>)}

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
