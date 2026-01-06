import { StyleSheet, Text, View } from "react-native";
import {ButtonModern} from "../ui/ButtonModern";
import { theme } from "@/src/theme";

export interface UserCardProps {
    title: string, 
    description: string
}

export function UserCard({description, title}: UserCardProps) {
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.textTitle}>
                    {title}
                </Text>
                <Text style={styles.textDescription}>
                    {description}
                </Text>
            </View>
            
            {/* Botoes ou status */}
            <View 
                style={styles.statusContainer}
            >
                {/* <ButtonModern placeholder="Aceitar" iconName="check" size="M"/>
                <ButtonModern placeholder="Recusar" iconName="x" size="M" variant="outline"/> */}
                
                <ButtonModern placeholder="Fazer Pedido" size="M"/>
                <ButtonModern placeholder="Cancelar" size="M" variant="outline"/>

                {/* <ButtonModern placeholder="Aguardando Aprovação" size="M" variant="disabled"/> */}
                
                {/* <ButtonModern placeholder="Solicitar Parceria" size="M" variant="outline"/> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        gap: theme.gap.sm,
        padding: theme.padding.sm,
        
        borderWidth: 1,
        borderColor: theme.colors.pseudoLightGray,
        borderRadius: theme.radius.sm,
    }, 
    statusContainer: {
        flexDirection: "row",
        gap: theme.gap.sm

    },
    textTitle: {
        fontSize: theme.typography.textLG.fontSize,
        fontWeight: "bold",
        color: theme.colors.textNeutral900
    },
    textDescription: {
        color: theme.colors.darkGray
    }
});