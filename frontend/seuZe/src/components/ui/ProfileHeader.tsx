import { theme } from "@/src/theme";
import { StyleSheet, Text } from "react-native";
import { HeaderBottomContainer } from "./HeaderBottomContainer";

interface ProfileHeaderProps {
    nome: string, 
    apelido: string
}

export function ProfileHeader({
    apelido, 
    nome
}: ProfileHeaderProps) {
    return (
        <HeaderBottomContainer 
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
        </HeaderBottomContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        width: "100%",
        justifyContent: "space-between",
        alignItems: "center",
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