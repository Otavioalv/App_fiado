import { ButtonIcon } from "@/src/components/ui/ButtonIcon";
import { DefaultDescription } from "@/src/components/ui/DefaultDescription";
import { SpacingScreenContainer } from "@/src/components/ui/SpacingScreenContainer";
import { theme } from "@/src/theme";
import { useLocalSearchParams, useRouter, withLayoutContext } from "expo-router";
import { Text, View } from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import { HeaderBottomContainer } from "@/src/components/ui/HeaderBottomContainer";


const Tab = createMaterialTopTabNavigator();
// const MaterialTopTabs = withLayoutContext(Navigator);

export default function FornecedorDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    
    const router = useRouter();
    
    

    return (
        <>
            <HeaderBottomContainer
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottomWidth: 0,
                    // backgroundColor: "red",
                }}
            >
                <ButtonIcon
                    iconName="arrow-left"
                    variant="ghost"
                    onPress={() => router.back()}
                />

                <DefaultDescription
                    size="M"
                    text1="Macedo, Pereira e Souza"
                    text2="RESP"
                />

                <ButtonIcon
                    iconName="phone"
                    variant="outline"
                />


            </HeaderBottomContainer>
                <Tab.Navigator
                    screenOptions={{
                        tabBarActiveTintColor: theme.colors.orange,
                        tabBarInactiveTintColor: 'gray',
                        tabBarIndicatorStyle: { 
                            backgroundColor: theme.colors.orange, 
                            height: 3
                        },
                        tabBarLabelStyle: { 
                            fontWeight: 'bold', 
                            textTransform: 'capitalize' 
                        }
                    }}
                >
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
                    <Tab.Screen 
                        name="Produtos" 
                        component={() => 
                            <View>
                                <Text>
                                    Produtos
                                </Text>
                            </View>
                        } 
                    />
                </Tab.Navigator>
            
            {/* <SpacingScreenContainer>
                <Text>
                    {id}
                </Text>
            </SpacingScreenContainer> */}
        </>
    );
}
