import { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";
import { theme } from "../theme";


export function useAnimationOpacitySkeleton() {
    const initialValue: number = .5
    const anmOpacity = useRef(new Animated.Value(initialValue)).current;
    
    const styles: ViewStyle = {
        opacity: anmOpacity,
        backgroundColor: theme.colors.pseudoLightGray, 
    }

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(anmOpacity, {
                    toValue: 1, 
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(anmOpacity, {
                    toValue: initialValue, 
                    duration: 800,
                    useNativeDriver: true
                })
            ])
        );

        animation.start();

        return () => animation.stop();
    }, [anmOpacity]);

    return styles;
}
