import { useAnimationOpacitySkeleton } from "@/src/hooks/useMyAnimations";
import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Dispatch, SetStateAction } from "react";
import { Animated, Pressable, StyleSheet, Text, View } from "react-native";




interface StepperProps {
    quanity: number,
    setQuanity: Dispatch<SetStateAction<number>>,
    isLoading?: boolean,
};



export function Stepper({
    quanity,
    setQuanity,
    isLoading = false,
}: StepperProps) {
    if(isLoading) 
        return <StepperSkeleton/>

    const handlePlusQnt = () => {
        setQuanity(quanity+1);
    }

    const handleMinusQnt = () => {
        if(quanity > 1) {
            setQuanity(quanity-1);
        }
    }


    return (
        <View
            style={styles.container}
        >
            <Pressable
                onPress={handleMinusQnt}
                style={[
                    styles.button,
                    styles.buttonMinus
                ]}
            >
                <Feather 
                    name="minus"
                    style={[
                        styles.icon,
                        styles.iconMinus,
                    ]}
                />
            </Pressable>
            <Text
                style={
                    styles.count
                }
            >
                {quanity}
            </Text>
            <Pressable
                onPress={handlePlusQnt}
                style={[
                    styles.button,
                    styles.buttonPlus
                ]}
            >
                <Feather 
                    name="plus" 
                    style={[
                        styles.icon,    
                        styles.iconPlus,
                    ]}
                />
            </Pressable>
        </View>
    );
}


export function StepperSkeleton() {
    const anmOpacity = useAnimationOpacitySkeleton();


    return (
        <Animated.View
            style={[
                styles.container
            ]}
        >
            <Animated.View
                style={[
                    anmOpacity,
                    styles.buttonSkeleton
                ]}
            />
            <Animated.View
                style={[
                    anmOpacity,
                    styles.countSkeleton,
                ]}
            />
            <Animated.View
                style={[
                    anmOpacity,
                    styles.buttonSkeleton,
                ]}
            />
        </Animated.View>
    );
}


const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.gap.xs
        // backgroundColor: "blue"
    },

    count: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textSM.fontSize
    },
    countSkeleton: {
        borderRadius: theme.radius.xs,
        width: 10, 
        height: 20,
    },
    
    button: {
        padding: 10,
        paddingHorizontal: theme.padding.sm,
        borderRadius: theme.radius.sm,
    },
    buttonPlus: {
        backgroundColor: theme.colors.orange,
    },
    buttonMinus: {
        backgroundColor: theme.colors.pseudoLightGray,
    },
    buttonSkeleton: {
        borderRadius: theme.radius.sm,
        width: 44, 
        height: 36,
    },
    icon:{
        fontSize: theme.typography.textSM.fontSize
    },
    iconPlus: {
        color: "white",
    },
    iconMinus: {
        color: theme.colors.darkGray
    }
}); 
