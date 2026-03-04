import { Stack } from "expo-router";


export default function FornecedorLayout() {
    return (
        <Stack 
            initialRouteName="(tabs)"
            screenOptions={{
                headerShown: false,
                animation: 'none'
            }}  
        >
            <Stack.Screen name="(tabs)"/>
            <Stack.Screen name="notificacoes"/>
        </Stack>
    )
}
