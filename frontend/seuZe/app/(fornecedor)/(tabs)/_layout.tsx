import { theme } from "@/src/theme";
import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";


export default function TabsLayoutForn() {
    return(
        <Tabs
            initialRouteName="produtos" 
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
                    title: "Meus Produtos",
                    tabBarIcon: ({color}) => 
                        <Feather name="package" size={24} color={color}/>,
                }}
            />

            <Tabs.Screen
                name="clientes"
                options={{
                    title: "Clientes",
                    tabBarIcon: ({color}) => 
                        <Feather name="briefcase" size={24} color={color}/>,
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