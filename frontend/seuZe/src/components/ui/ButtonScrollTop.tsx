import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";


type ButtonScrollTopProps = {onPress: () => void}

export function ButtonScrollTop({
    onPress
}: ButtonScrollTopProps) {
    const buttonAnim = useRef(new Animated.Value(1)).current;
    
    
    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }



    return (
        <Animated.View
            style={[{ opacity: buttonAnim }]}
        >
            <Pressable
                style={styles.container}
                onPress={onPress}
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
            >
                <Feather
                    name="arrow-up"
                    style={styles.icon}
                />
            </Pressable>
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: theme.colors.orange,
        width: 60,
        height: 60,
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999
    },
    icon: {
        color: "white",
        fontSize: theme.typography.textLG.fontSize
    }
});
