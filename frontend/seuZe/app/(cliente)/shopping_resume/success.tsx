import FeedbackTemplate from "@/src/components/common/FeedbackTemplate";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { useRouter } from "expo-router";
import { ScreenContainer } from "react-native-screens";

export default function Success() {
    const router = useRouter();

    return(
        <MyScreenContainer>
            <FeedbackTemplate
                description={`Acompanhe o pedido na aba de "Compras"`}
                title="Compra realizada com sucesso"
                iconName="shopping-cart"
                primaryAction={{
                    label: "HOME",
                    onPress: () => {router.replace("/home")}
                }}
            />
        </MyScreenContainer>
    )
}