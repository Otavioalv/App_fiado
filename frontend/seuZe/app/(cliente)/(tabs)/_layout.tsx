import { Tabs } from "expo-router";
import Feather from '@expo/vector-icons/Feather';
import { theme } from "@/src/theme";

export default function TabsLayout() {
    return (
        <Tabs
            initialRouteName="home" 
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.orange,
                tabBarInactiveTintColor: theme.colors.darkGray,
                tabBarStyle: {
                    borderColor: theme.colors.pseudoLightGray,
                    backgroundColor: "#ffffff"
                }
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Início",
                    tabBarIcon: ({color}) => 
                        <Feather name="home" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="produtos"
                options={{
                    title: "Produtos",
                    tabBarIcon: ({color}) => 
                        <Feather name="package" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="fornecedores"
                options={{
                    title: "Fornecedores",
                    tabBarIcon: ({color}) => 
                        <Feather name="truck" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="compras"
                options={{
                    title: "Compras",
                    tabBarIcon: ({color}) => 
                        <Feather name="shopping-bag" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({color}) => 
                        <Feather name="user" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="teste"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    )
}
