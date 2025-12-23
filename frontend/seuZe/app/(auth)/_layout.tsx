import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AuthLayout() {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#FFFFFF"}} edges={['bottom']}>
            <Stack 
                screenOptions={{
                    headerShown: false,
                    animation: "none"
                }} 
                initialRouteName="login"
            />
        </SafeAreaView>
    )
}