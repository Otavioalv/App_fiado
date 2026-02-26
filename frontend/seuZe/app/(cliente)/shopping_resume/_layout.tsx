import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ShoppingResumeLayout() {
    return (
        <SafeAreaView style={{flex:1}} edges={['bottom']}>

            <Stack 
                screenOptions={{ 
                    headerShown: false,
                    animation: "none",
                }}
            >   
                <Stack.Screen 
                    name="index"
                />
                <Stack.Screen 
                    name="success"
                />
            </Stack>
        </SafeAreaView>
    );
}
