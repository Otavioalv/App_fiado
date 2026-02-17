import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NotificacoesLayout() {
    return (
        <SafeAreaView style={{flex:1}} edges={['bottom']}>

            <Stack 
                screenOptions={{ 
                    headerShown: false,
                    animation: "none",
                    // animation: 'slide_from_leftQ',
                    // animationDuration: 100,
                }}
            >   
                <Stack.Screen 

                    name="index"
                />
            </Stack>
        </SafeAreaView>
    );
}
