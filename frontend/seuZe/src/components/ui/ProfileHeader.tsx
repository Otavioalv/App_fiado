import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";

interface ProfileHeaderProps {
    nome: string, 
    apelido: string
}

export function ProfileHeader({
    apelido, 
    nome
}: ProfileHeaderProps) {
    return (
        <View   
            style={styles.container}
        >
            <Text
                style={styles.nomeText}
            >
                {nome}
            </Text>
            <Text 
                style={styles.apelidoText}
            >
                {apelido}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#ffffff",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
        padding: theme.padding.md,
        paddingVertical: theme.padding.lg,
    
    },
    nomeText: {
        ...theme.typography.textXL,
        color: theme.colors.textNeutral900,
        fontWeight: "900"
    }, 
    apelidoText: {
        color: theme.colors.textNeutral900,
        fontSize: theme.typography.textMD.fontSize,
    }
});