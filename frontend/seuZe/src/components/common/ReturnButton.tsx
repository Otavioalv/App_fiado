import { useRouter } from "expo-router";
import { View } from "react-native";
import { ButtonModern } from "../ui/ButtonModern";

export default function ReturnButton() {
    const router = useRouter();
    

    return (
        <View
            style={{alignItems: "flex-start"}}
        >
            <ButtonModern
                placeholder="Voltar"
                size="S"
                variant="ghost"
                iconName="chevron-left"
                onPress={() => router.back()}
            />
        </View>
    );
}
