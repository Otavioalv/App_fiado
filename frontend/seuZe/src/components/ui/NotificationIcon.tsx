import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { NotificationType } from "@/src/types/responseServiceTypes";
import { Feather } from "@expo/vector-icons";
import  { StyleSheet, Animated } from "react-native";

interface NotificationIconProps {
    type: NotificationType, 
    isActivate: boolean,
};

const IconNotiifcationMap: Record<NotificationType, keyof typeof Feather.glyphMap> = {
    accepted_partner: "user-check",
    new_partner: "users",
    purchase_accepted: "check-circle",
    purchase_rejected: "x-circle",
    purchase_request: "shopping-cart",
    purchase_updated: "edit-3", 
}

export function NotificationIcon({
    type, 
    isActivate,
}: NotificationIconProps) {

    const iconName = IconNotiifcationMap[type];
    return (
        <Feather
            name={iconName}
            style={[
                styles.icon,
                isActivate && (styles.iconAlert)
            ]}
        />
    );
}

export function NotificationIconSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();

    return (
        <Animated.View
            style={[anmOpacity, styles.iconSkeleton]}
        />
    );
}

const styles = StyleSheet.create({
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
        backgroundColor: theme.colors.lightOrange,
        color: theme.colors.orange,
    },
});