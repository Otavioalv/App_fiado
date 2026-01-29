import { theme } from "@/src/theme";
import { StyleSheet, Text, View } from "react-native";


type BottomVersionProps = {version: string}
export function BottomVersion({
    version
}: BottomVersionProps) {
    return (
        <View   
            style={styles.container}
        >
            <Text
                style={styles.text}
            >
                Versão {version}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        
        // backgroundColor: "red",
    },
    text: {
        textAlign: "center",
        color: theme.colors.darkGray,
    }
});