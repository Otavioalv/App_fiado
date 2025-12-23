import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';


type UserHeaderProps = {
    nome: string,
    apelido?: string
}

export function UserHeader({apelido, nome}: UserHeaderProps) {
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

const styles = StyleSheet.create({
    container: {
        // backgroundColor: "red",
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
    }
});