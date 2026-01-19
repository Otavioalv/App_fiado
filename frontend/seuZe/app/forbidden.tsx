import FeedbackError from "@/src/components/common/FeedbackError";
import MyScreenContainer from "@/src/components/common/MyScreenContainer";
import { useSession } from "@/src/context/authContext";
import { useRouter } from "expo-router";

export default function Forbidden() {
    const router = useRouter();
    const { signOut } = useSession();
    
    const bttAction = () => {
        signOut();
        router.replace("/(auth)/login")
    }


    return (
        <MyScreenContainer>
            <FeedbackError
                errorType="FORBIDDEN"
                onAction={bttAction}
            />
        </MyScreenContainer>
    );
}
