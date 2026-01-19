import { theme } from "@/src/theme";
import { ActivityIndicator, Modal, StyleSheet, View } from "react-native";

type LoadingProps = {
    visible: boolean
}

export default function Loading({visible}: LoadingProps) {
    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={visible}
            onRequestClose={() => {}}
        >
            <View style={styles.container}>
                <ActivityIndicator size={"large"} color={theme.colors.orange}/>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, .5)"
    }
});
