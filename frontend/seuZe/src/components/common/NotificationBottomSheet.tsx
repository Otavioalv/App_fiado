import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import MyScreenContainer from "./MyScreenContainer";
import { StyleSheet, Text, View } from "react-native";
import { ButtonModern } from "../ui/ButtonModern";
import { theme } from "@/src/theme";
import { NotificationIcon } from "../ui/NotificationIcon";
import { NotificationType } from "@/src/types/responseServiceTypes";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Href, useRouter } from "expo-router";


export interface NotificationBottomSheetProps {
    title: string,
    message: string, 
    type: NotificationType,
    isRead: boolean,
    dateTime: string,
    notificationId: string | number, 
    userId: string | number,
    routerName: Href
};

export function NotificationBottomSheet({
    dateTime, 
    message, 
    title, 
    type, 
    notificationId,
    userId,
    isRead,
    routerName
}: NotificationBottomSheetProps){
    const router = useRouter();


    const formatFullDateTime = (dateString: string): string => {
        if (!dateString) return "";

        try {
            const date = parseISO(dateString);

            // 2. Formatamos seguindo o padrão da sua segunda imagem
            // 'às' entre aspas simples para o date-fns ignorar como caractere especial
            return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
        } catch (error) {
            console.error("Erro ao formatar data:", error);
            return dateString;
        }
    };

    const newDateTime: string = formatFullDateTime(dateTime);
    return (
        <BottomSheetScrollView>
            <MyScreenContainer
                style={styles.container}
            >
                <View
                    style={styles.messageContainer}
                >
                    <View
                        style={styles.topMessage}
                    >
                        <NotificationIcon
                            isActivate={isRead}
                            type={type}
                        />
                        <Text
                            style={styles.textTitle}
                        >
                            {title}
                        </Text>
                    </View>

                    <View
                        style={styles.messageContent}
                    >
                        <Text
                            style={styles.textMessage}
                        >
                            {message}
                        </Text>

                        <Text
                            style={styles.textDateTime}
                        >
                            {newDateTime}
                        </Text>
                    </View>


                </View>

                <View
                    style={styles.bottomMessage}
                >
                    <ButtonModern
                        variant="ghost"
                        size="S"
                        placeholder="Visitar usuário"
                        onPress={() => router.push(routerName)}

                    />
                </View>
            </MyScreenContainer>
        </BottomSheetScrollView>
    );
}


const styles = StyleSheet.create({
    container: {
        alignItems: "stretch",
        justifyContent: "space-between",
    },
    messageContainer: {
        gap: theme.gap.sm,
    },
    topMessage: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.gap.md
    },
    bottomMessage: {
        gap: theme.gap.md,
        // backgroundColor: "red",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: theme.padding.md,
        borderRadius: theme.radius.sm,
        backgroundColor: theme.colors.pseudoLightGray
    },
    messageContent: {
        gap: theme.gap.sm,
    },

    textTitle: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900,
    },
    textMessage: {
        fontSize: theme.typography.textMD.fontSize,
        color: theme.colors.textNeutral900,
    },
    textDateTime: {
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.darkGray,
    },
    textButton: {
        color: theme.colors.darkGray
    }
});
