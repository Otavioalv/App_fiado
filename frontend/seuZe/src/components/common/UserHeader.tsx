import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import { DefaultDescription, DefaultDescriptionSkeleton } from "../ui/DefaultDescription";
import { HeaderBottomContainer } from "../ui/HeaderBottomContainer";

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
        <HeaderBottomContainer style={styles.container}>
            <DefaultDescription
                text1={`Olá, ${nome}!`}
                text2={`Apelido: ${apelido}`}
                size="M"
            />
            {/* Fazer um boatao */}
            <View style={styles.bellNotify}>
                <Feather name="bell" size={24} color={theme.colors.textNeutral900} />
                
                <View style={styles.notifyCounter}>
                    <Text style={styles.textCounter}>
                        3
                    </Text>
                </View>
            </View>
        </HeaderBottomContainer>
    );
}

export function UserHeaderSkeleton() {
    return (
        <HeaderBottomContainer style={styles.container}>
            <DefaultDescriptionSkeleton size="M"/>

            <View style={styles.bellNotify}>
                <Feather name="bell" size={24} color={theme.colors.textNeutral900} />
            </View>
        </HeaderBottomContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
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
    }
});
