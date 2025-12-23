import { StyleSheet, View, Text} from "react-native";
import {Feather} from "@expo/vector-icons";
import { theme } from "@/src/theme";
import ButtonModern from "../ui/ButtonModern";
import { useRouter } from "expo-router";

export default function NoPurchases() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <Feather name="package" size={96} style={styles.icon}/>
            <Text style={styles.textTitle}> 
                Você ainda não fez compras
            </Text>
            <Text style={styles.textDesc}>
                Suas compras aparecerão aqui quando vocẽ coletar um produto.
            </Text>

            <View style={styles.buttonContainer}>
                <ButtonModern 
                    placeholder="Ver Produtos" 
                    onPress={() => router.push("/(cliente)/produtos")}
                />
                <ButtonModern 
                    placeholder="Explorar Fornecedores" 
                    variant="outline"
                    onPress={() => router.push("/(cliente)/fornecedores")}
                />
            </View>
        </View>
    );
}   

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: theme.gap.md,
        
        // backgroundColor: "blue"
    },
    buttonContainer: {
        gap: theme.gap.sm,
        // backgroundColor: "red",
        // flex: 1,
        // width: "100%"
    },
    icon: {
        color: theme.colors.lightGray
    },
    textTitle: {
        ...theme.typography.textXL,
        color: theme.colors.textNeutral900,
        fontWeight: "900"
    },
    textDesc: {
        fontSize: theme.typography.textMD.fontSize,
        textAlign: "center",
        color: theme.colors.textNeutral900
        // backgroundColor: "red"
    }
});