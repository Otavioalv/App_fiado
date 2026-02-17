import { theme } from "@/src/theme";
import { NotificationType } from "@/src/types/responseServiceTypes";
import { Feather } from "@expo/vector-icons";
import { memo } from "react";
import { View, Text, PressableProps, StyleSheet, Animated } from "react-native";
import { format, isYesterday, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";



export interface NotificationCardProps extends PressableProps {
    type: NotificationType, 
    time: string,
    notification: string,
    isRead: boolean,
    itemId: string | number, 
}

export function NotificationCard({
    isRead,
    notification,
    time,
    type,
}: NotificationCardProps) {
    const notificationTypeMap: Record<NotificationType, string> = {
        new_partner: "Solicitação de Parceria"
    }

    const textTitle = notificationTypeMap[type];

    // Colocar isso em um utils
    const formatRelativeDate = (dateString: string): string  => {
        if (!dateString) return "";
    
        const date = parseISO(dateString);
        const now = new Date();

        const diffInMs = now.getTime() - date.getTime();
    
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

        if(isToday(date)) {
            if(diffInMinutes < 1) return "Agora mesmo";
            if(diffInMinutes < 60) return `Há ${diffInMinutes}min`;
            if(diffInHours < 24) return `Há ${diffInHours}h`;
        }

        if(isYesterday(date)) return "Ontem";

        return format(date, "dd 'de' MMM", { locale: ptBR });
    }


    return (
        <View
            style={[
                styles.container,
                isRead && styles.alertContainer,
            ]}
        >
            {/* Definir icone de acorde com o tipo da menssagem */}
            {/* Definir estilo de menssagem lida e nao lida */}
            <Feather
                name="users"
                style={[
                    styles.icon,
                    isRead && (styles.iconAlert)
                ]}
            />

            <View 
                style={styles.messageContainer}
            >
                <View style={styles.footerMessage}>
                    {/* Definir titulo de acordo com o tipo (backend tem q fazer isso)*/}
                    <Text
                        style={styles.titleText}
                    >
                        {textTitle}
                    </Text>

                    <View
                        style={styles.infoNotification}
                    >
                        <Text
                            style={styles.textTime}
                        >
                            {formatRelativeDate(time)}
                            {/* {time} */}
                        </Text>
                        {isRead && (
                            <View style={styles.isReadIcon}/>
                        )}
                    </View>
                </View>

                <View style={{
                    flexDirection: "row"
                }}>
                    <Text 
                        style={[
                            styles.textNotification,
                            isRead && (styles.textNotificationAlert)
                        ]}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {notification}
                        Um pouco da menssagem Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iure, iste. Velit labore nisi officia iste itaque esse dolor natus totam ducimus sed laudantium voluptas cumque saepe sunt facilis, odit tempora.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt, mollitia in porro, ullam itaque, sequi dignissimos voluptas ut perferendis debitis modi nulla veniam quisquam? Eveniet ducimus assumenda inventore ab accusantium.
                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eum ducimus atque dolorem eaque error. Ipsum cum facilis accusantium quo, recusandae, officiis animi error adipisci dolore ullam sunt quisquam quis?.
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Voluptatum, impedit inventore! Rem tempore beatae dolorem. Error laboriosam quam quaerat molestias alias expedita unde nam tempore, harum, ea aspernatur minus esse.
                        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse voluptatum quidem eaque laudantium et. Saepe, ipsa. Quaerat autem commodi modi molestiae, officia, voluptatibus aliquid voluptates libero, doloremque quasi iure ipsa.
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Rerum pariatur tempora modi, qui culpa ullam corporis unde dolore, dolor quo necessitatibus placeat illo nisi, sit vitae veritatis animi earum totam!
                    </Text>
                </View>
            </View>
        </View>
    );
}

export const MemoNotificationCard = memo(NotificationCard);


export function NotificationCardSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <View style={styles.container}>

            <Animated.View
                style={[anmOpacity, styles.iconSkeleton]}
            />
            
            
            <View style={styles.messageContainer}>
                <View style={styles.footerMessage}>
                    <Animated.View style={[anmOpacity, styles.titleTextSkeleton]}/>
                    <Animated.View style={[anmOpacity, styles.textTimeSkeleton]}/>
                </View>
                <Animated.View style={[anmOpacity, styles.textNotificationSkeleton]}/>
            </View>
        </View>
    );
}

export const MemoNotificationCardSkeleton = memo(NotificationCardSkeleton);



const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: theme.gap.sm,
        padding: theme.padding.sm,
        // maxHeight: 90,
        // width: '100%',
        // backgroundColor: "blue",
        // padding: 1,
    },
    alertContainer: {
        backgroundColor: theme.colors.orange + "11",
    },
    messageContainer: {
        // backgroundColor: "red",
        flex: 1,
        gap: theme.gap.xs,
    },
    
    // ICONES
    icon: {
        fontSize: theme.typography.textXL.fontSize,
        backgroundColor: theme.colors.pseudoLightGray,
        color: theme.colors.darkGray,
        borderRadius: 1000,
        padding: theme.padding.sm,
    },
    iconSkeleton: {
        width: 55,
        height: 55,
        borderRadius: 1000,
    },
    
    iconAlert: {
        backgroundColor: theme.colors.orange,
        color: "white",
    },


    // Texto
    titleText: {
        fontSize: theme.typography.textMD.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900,
    },
    titleTextSkeleton: {
        width: 180, 
        height: 15,
        borderRadius: 1000,
    },

    textTime: {
        color: theme.colors.darkGray
    },
    textTimeSkeleton: {
        width: 70,
        height: 15,
        borderRadius: 1000,
    },

    textNotification: {
        // backgroundColor: "blue",
        fontSize: theme.typography.textSM.fontSize,
        color: theme.colors.darkGray,
    },
    textNotificationSkeleton: {
        width: "100%",
        height: 45,
        borderRadius: 1000,
    },
    textNotificationAlert: {
        color: theme.colors.textNeutral900
    },

    footerMessage: {
        flexDirection: "row", 
        justifyContent: "space-between",
        // backgroundColor: "gray"
        // flex: 1,
    },
    infoNotification: {
        flexDirection: "row",
        gap: theme.gap.xs,
        alignItems: "center"
    },
    isReadIcon: {
        width: 10,
        height: 10,
        backgroundColor: theme.colors.orange,
        borderRadius: 1000,
    },
});

