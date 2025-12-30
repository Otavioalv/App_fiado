import { StyleSheet, View, Text} from "react-native";
import {Feather} from "@expo/vector-icons";
import { theme } from "@/src/theme";
import ButtonModern from "../ui/ButtonModern";

interface ActionButtonProps {
    label: string;
    onPress: () => void;
}

interface EmptyStateProps {
    buttonAction?: ActionButtonProps;
}

export default function NetworkOff({buttonAction}: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <Feather style={styles.icon} name="wifi-off"/>
            <Text style={styles.textTitle}> 
                Sem Conexão
            </Text>
            <Text style={styles.textDesc}>
                Parece que você está offline ou sua internet está lenta. Verifique sua conexão e tente novamente
            </Text>
            
            <View style={styles.buttonContainer}>
                {buttonAction && (
                    <ButtonModern 
                        placeholder={buttonAction.label} 
                        onPress={buttonAction.onPress}
                    />
                )}
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
        // backgroundColor: "blue",
    },
    buttonContainer: {
        gap: theme.gap.md,
        // backgroundColor: "red",
        // flex: 1,
        // width: "100%"
    },
    icon: {
        color: theme.colors.orange,
        fontSize: theme.typography.text10XL.fontSize
    },
    textTitle: {
        ...theme.typography.textXL,
        color: theme.colors.textNeutral900,
        fontWeight: "bold"
    },
    textDesc: {
        fontSize: theme.typography.textMD.fontSize,
        textAlign: "center",
        color: theme.colors.textNeutral900
        // backgroundColor: "red"
    }
});
