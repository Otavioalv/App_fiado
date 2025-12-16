import { useSession } from "@/src/context/authContext";
import { SplashScreen } from "expo-router";

// documentação
export function SplashScreenController() {
    const { isLoading } = useSession();

    if(!isLoading) {
        SplashScreen.hide();
    }

    return null;
}