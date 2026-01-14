import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";

interface FilterOptionsProps {
    onPress: () => void; 
}

export default function FilterButton({ onPress }: FilterOptionsProps) {
    return (
        <Pressable
            style={styles.buttonContainer}
            onPress={onPress}
        >
            <Feather
                style={styles.icon}
                name="sliders"
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: "center",
        justifyContent: "center"
    },
    icon: {
        fontSize: theme.typography.textLG.fontSize,
        padding: theme.padding.xs,
        paddingHorizontal: theme.padding.sm,
        color: theme.colors.orange,
        transform: "rotate(90deg)"
    }
});