import { Stack } from "expo-router";


export default function FornecedorLayout() {
    return (
        <Stack 
            screenOptions={{
                headerShown: false,
                animation: 'none'
            }}  
            initialRouteName="home"
        />
    )
}