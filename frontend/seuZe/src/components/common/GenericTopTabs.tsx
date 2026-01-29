import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Text, View } from "react-native";

export interface TabItem {
    
}

const Tab = createMaterialTopTabNavigator();

export function GenericTopTabs() {
    return (
        <Tab.Navigator>


            <Tab.Screen
                name="Sobre"
                component={() => 
                    <View>
                        <Text>
                            sobre
                        </Text>
                    </View>
                } 
            />
        </Tab.Navigator>
    );
}
