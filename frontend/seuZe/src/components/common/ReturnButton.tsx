import { theme } from "@/src/theme";
import { useRouter } from "expo-router";
import { Text, Pressable, StyleSheet, Animated } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRef } from "react";

export default function ReturnButton() {
    const router = useRouter();
    const buttonAnim = useRef(new Animated.Value(1)).current;
    
    const animation = (to: number) => {
        Animated.timing(buttonAnim, {
            toValue: to,
            duration: 100,
            useNativeDriver: true
        }).start();
    }
    

    return (
        <Animated.View style={[style.buttonContainer, {opacity: buttonAnim}]}>
            <Pressable
                onPress={() => router.back()}
                onPressIn={() => animation(.8)}
                onPressOut={() => animation(1)}
                style={style.button}
            >   
                <MaterialIcons name="keyboard-arrow-left" size={24} color={theme.colors.orange} />

                <Text style={style.text}>
                    Voltar
                </Text>
            </Pressable>
        </Animated.View>
    );
}

const style = StyleSheet.create({
    buttonContainer: {
        backgroundColor: theme.colors.bgBttDefault,
        borderRadius: theme.radius.sm,
        alignSelf: "flex-start",
        overflow: "hidden"
    }, 
    button: {
        paddingHorizontal: theme.padding.sm,
        flexDirection: "row",
        alignItems: "center",
        padding: theme.padding.xs,
        // backgroundColor: "red"
    },  
    text: {
        color: theme.colors.orange,
        fontWeight: "bold",
        fontSize: theme.typography.textSM.fontSize
    }
});
