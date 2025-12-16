import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";
import Feather from '@expo/vector-icons/Feather';


export function UserHeader() {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textName}>
                    Olá, joao silva!
                </Text>
                <Text style={styles.textSubName}>
                    Apelido: J.S.
                </Text>
            </View>


            {/* Fazer um boatao */}
            <View style={styles.bellNotify}>
                <Feather name="bell" size={24} color="black" />
                
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
        borderColor: theme.colors.pseudoLightGray,
        paddingHorizontal: theme.padding.md,
        paddingBottom: theme.padding.sm,
    }, 
    textName: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: 'bold'
    },
    textSubName: {
        fontSize: theme.typography.textMD.fontSize
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