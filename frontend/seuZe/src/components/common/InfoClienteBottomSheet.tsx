import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { View, Text, StyleSheet, Animated } from "react-native";
import MyScreenContainer from "./MyScreenContainer";
import { OnPressActionFunctionType, RelationshipActions } from "../ui/RelationshipActions";
import { useListPartnerFromId, useUpdatePartnerInfoCliente } from "@/src/hooks/useFornecedorQueries";
import { Feather } from "@expo/vector-icons";
import { theme } from "@/src/theme";
import { formatPhone } from "@/src/utils";
import { useCallback, useState } from "react";
import { ErrorTypes } from "@/src/types/responseServiceTypes";
import { useErrorScreenListener } from "@/src/hooks/useErrorScreenListener";
import { ScreenErrorGuard } from "./ScreenErrorGuard";
import { PressablePress } from "../ui/PressablePress";
import * as Clipboard from 'expo-clipboard';
import Toast from "react-native-toast-message";
import { RelationshipActionProductSkeleton } from "../ui/RelationshipActionProduct";
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
interface InfoClienteBottomSheetProps {
    idCliente: number | string
}

export function InfoClienteBottomSheet({
    idCliente,
}: InfoClienteBottomSheetProps) {
    const [errorType, setErrorType] = useState<ErrorTypes | null>(null);

    const {
        data: userData,
        isLoading: isLoadingUserData,
        isError: isErrorUserData,
        error: errorUserData,
        refetch: refetchUserData,   
    } = useListPartnerFromId(           
        idCliente
    );

    const { mutate } = useUpdatePartnerInfoCliente(idCliente);
    
    const handleAction: OnPressActionFunctionType = useCallback(({ id, newStatus }) => {
        mutate({ id: id, newStatus: newStatus });
    }, [mutate]);

    const numberFormat = formatPhone(userData?.telefone);

    const copyPhone = async () => {
        await Clipboard.setStringAsync(numberFormat);

        Toast.show({
            type: "success",
            text1: "Número copiado com sucesso!"
        });
    };

    
    useErrorScreenListener(isErrorUserData, errorUserData, setErrorType);
    
    
    if(isLoadingUserData) {
        return <InfoClienteBottomSheetSkeleton/>
    }

    return (
        <BottomSheetScrollView>
            <ScreenErrorGuard errorType={errorType} onRetry={refetchUserData}>

                <MyScreenContainer
                    style={{
                        alignItems: "stretch",
                    }}
                >
                    <View style={styles.infoTop}>
                        <Text style={styles.textName} numberOfLines={1}>
                            {userData?.nome}
                        </Text>
                        <Text style={styles.textApelido} numberOfLines={1}>
                            {userData?.apelido || ""}
                        </Text>
                    </View>

                    <PressablePress 
                        style={styles.infoPhoneButton}
                        onPress={copyPhone}
                    >
                        <Feather
                            name="phone"
                            style={[
                                styles.icon,
                            ]}
                        />
                        <View style={styles.sectionInfo}>
                            <Text style={styles.textTitleInfo}>
                                Telefone
                            </Text>
                            <Text style={styles.textValueInfo} numberOfLines={1}>
                                {numberFormat}
                            </Text>
                        </View>
                    </PressablePress>

                    <RelationshipActions
                        type={userData?.relationship_status || "NONE"}
                        idUser={idCliente}
                        isClient={false}
                        isLoading={isLoadingUserData}
                        onPressAction={handleAction}
                        // onPressAccepted={onPressAccepted}
                    />
                </MyScreenContainer>
            </ScreenErrorGuard>
        </BottomSheetScrollView>
    )
}

export function InfoClienteBottomSheetSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return(
        <BottomSheetScrollView>
            <MyScreenContainer
                style={{
                    alignItems: "stretch",
                }}
            >

                <View style={styles.infoTop}>
                    <Animated.View style={[anmOpacity, styles.textTitleSkeleton]}/>
                    <Animated.View style={[anmOpacity, styles.textTitleSkeleton]}/>
                </View>

                <View
                    style={styles.infoPhoneButton}
                >
                        <Animated.View style={[anmOpacity, styles.iconSkeleton]}/>

                        <View style={styles.sectionInfo}>
                            <Animated.View style={[anmOpacity, styles.textTitleSkeleton]}/>
                            <Animated.View style={[anmOpacity, styles.textTitleSkeleton]}/>
                        </View>

                </View>
                <RelationshipActionProductSkeleton/>
            </MyScreenContainer>
        </BottomSheetScrollView>
    )
}


const styles = StyleSheet.create({
    icon: {
        fontSize: theme.typography.textXL.fontSize,
        backgroundColor: theme.colors.lightOrange,
        color: theme.colors.orange,
        borderRadius: 1000,
        padding: theme.padding.sm,
    },
    infoTop: {
        flex: 1,
        alignItems: "center",
        gap: theme.gap.xs,
    },
    infoPhoneButton: {
        flexDirection: "row",
        gap: theme.gap.sm,
        alignItems: "center",
        borderRadius: 1000,
    },
    sectionInfo: {
        gap: theme.gap.xs,
    },
    textName: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "bold",
    },
    textApelido: {
        color: theme.colors.darkGray,
        fontSize: theme.typography.textMD.fontSize,
    },
    textTitleInfo: {
        color: theme.colors.darkGray,
        fontSize: theme.typography.textSM.fontSize,
    },
    textValueInfo: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold",
    },

    textTitleSkeleton: {
        width: 150, 
        height: 12,
        borderRadius: 1000,
    },
    iconSkeleton: {
        width: 55, 
        height: 55,
        borderRadius: 999
    }
});
