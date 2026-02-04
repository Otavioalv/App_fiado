import { theme } from "@/src/theme";
import { createMaterialTopTabNavigator, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs";
import { ComponentProps } from "react";
import { Dimensions } from "react-native";

const Tab = createMaterialTopTabNavigator();

export type TabItem = ComponentProps<typeof Tab.Screen>;

interface GenericTopTabsProps {
    tabs: TabItem[],
}


export function GenericTopTabs({
    tabs, 
}: GenericTopTabsProps) {

    const screenOptions: MaterialTopTabNavigationOptions = {
        tabBarActiveTintColor: theme.colors.orange,
        tabBarInactiveTintColor: theme.colors.darkGray,
        tabBarIndicatorStyle: { 
            backgroundColor: theme.colors.orange, 
            height: 3,
        },
        tabBarLabelStyle: { 
            fontWeight: 'bold', 
            textTransform: 'capitalize' 
        },
        tabBarItemStyle: {
            flex: 1, 
            alignItems: "center",
            justifyContent: "center"
        }
    };


    return (
        <Tab.Navigator
            screenOptions={screenOptions}
            backBehavior="none"
            initialLayout={{ width: Dimensions.get('window').width }} // Testar remover isso em produção
        >

            {tabs.map((item) => (
                <Tab.Screen
                    key={item.name}
                    {...item}
                />
            ))}

        </Tab.Navigator>
    );
}
