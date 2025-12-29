import { theme } from "@/src/theme";
import { Animated, StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { useEffect, useRef } from "react";

interface UserHeaderProps {
    nome: string,
    apelido?: string,
    isLoading?:boolean,
}

export function UserHeader({apelido, nome, isLoading=false}: UserHeaderProps) {
    if(isLoading) {
        return <UserHeaderSkeleton/>
    }
        

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textName}>
                    Olá, {nome}!
                </Text>

                {apelido && (
                    <Text style={styles.textSubName}>
                        Apelido: {apelido}
                    </Text>
                )}

            </View>
            {/* Fazer um boatao */}
            <View style={styles.bellNotify}>
                <Feather name="bell" size={24} color={theme.colors.textNeutral900} />
                
                <View style={styles.notifyCounter}>
                    <Text style={styles.textCounter}>
                        3
                    </Text>
                </View>
            </View>
        </View>
    );
}

export function UserHeaderSkeleton() {
    const anmOpacity = useRef(new Animated.Value(.5)).current;

    useEffect(() => {
        const animation = Animated.loop(
            Animated.sequence([
                Animated.timing(anmOpacity, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true
                }),
                Animated.timing(anmOpacity, {
                    toValue: .5,
                    duration: 800,
                    useNativeDriver: true
                })
            ])
        );

        animation.start();
    }, [anmOpacity])

    return (
        <View style={styles.container}>
            <View style={styles.textContainerSkeleton}>
                <Animated.View style={[styles.skeletonTextName, {opacity: anmOpacity}]}/>
                <Animated.View style={[styles.skeletonTextSubName, {opacity: anmOpacity}]}/>
            </View>

            <View style={styles.bellNotify}>
                <Feather name="bell" size={24} color={theme.colors.textNeutral900} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderBottomWidth: 1,
        backgroundColor: "#ffffff",
        borderColor: theme.colors.pseudoLightGray,
        paddingHorizontal: theme.padding.md,
        paddingVertical: theme.padding.sm,
    }, 
    textContainerSkeleton: {
        flex: 1, 
        gap: theme.gap.xs
    },
    textName: {
        fontSize: theme.typography.textLG.fontSize,
        color: theme.colors.textNeutral900,
        fontWeight: 'bold',
    },
    textSubName: {
        fontSize: theme.typography.textMD.fontSize,
        color: theme.colors.textNeutral900,
    },
    bellNotify: {
    },
    notifyCounter: {
        position: "absolute",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.orange,
        borderRadius: theme.radius.full,
        minWidth: 20,
        height: 20,
        left: 9,
        top: -3
    },
    textCounter: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center"
    },
    skeletonTextName: {
        height: 15, 
        width: "45%", 
        backgroundColor: theme.colors.pseudoLightGray, 
        borderRadius: theme.radius.sm
    },
    skeletonTextSubName: {
        height: 15, 
        width: "60%", 
        backgroundColor: theme.colors.pseudoLightGray, 
        borderRadius: theme.radius.sm
    },
});
