import { Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Stack, useRouter } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";
import {SystemBars} from "react-native-edge-to-edge";
import { ThemeProvider } from "@react-navigation/native";
import { MyDefaultTheme } from "@/src/constants/theme";
import Toast from "react-native-toast-message";
import { SessionProvider, useSession } from "@/src/context/authContext";
import { UserType } from "@/src/types/userType";
import { SplashScreenController } from "@/src/components/common/SplashScreenController";
import { useEffect } from "react";
import { NetworkProvider, useNetwork } from "@/src/context/networkContext";
import { registerForbiddenAction } from "@/src/services/api";


export default function RootLayout() {
  return (
    /* const colorScheme = useColorScheme(); / colorScheme === 'dark' ? MyDarkTheme : MyDefaultTheme */
    <ThemeProvider value={MyDefaultTheme}>
      {/* Autenticação */}
      <SessionProvider>
        <NetworkProvider>

          <SafeAreaProvider>
            <SafeAreaView style={{flex:1, backgroundColor: MyDefaultTheme.colors.background}} edges={['top']}>
              
              <SplashScreenController/>
              
              <KeyboardAvoidingView
                style={{ flex: 1}}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
              >
                <RootNavigator/>
                {/* <StatusBar style="dark"/>    */}
                <SystemBars style={"dark"}/>
                
              </KeyboardAvoidingView>
              <Toast/>
            </SafeAreaView>
          </SafeAreaProvider>
          
        </NetworkProvider>
      </SessionProvider>
    </ThemeProvider>
  );
}


// Seguindo documentação, muda automaticamente pra tela, ao loga, ou ao abri o app se tiver logado
function RootNavigator() {
  const {session, userType, isLoading} = useSession();
  const router = useRouter();

  useEffect(() => {
    registerForbiddenAction(() => router.replace("/forbidden"));
  }, [router]);
  
  // useEffect(() => {
  //   Alert.alert("Teste: ", `session: ${session}\n\nuserType: ${userType}`)
  // }, [session, userType]);

  if(isLoading) return null;

  // signOut();
  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        animation: 'none'
      }}
    >
      {/* <Slot/> */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)"/>
      </Stack.Protected>


      {/* Telas de cliente */}
      <Stack.Protected guard={!!session && (userType as UserType) === "cliente"}>
        <Stack.Screen name="(cliente)" options={{headerShown: false}}/>
      </Stack.Protected>

      {/* Telas de fornecedor */}
      <Stack.Protected guard={!!session && (userType as UserType) === "fornecedor"}>
        <Stack.Screen name="(fornecedor)"/>
      </Stack.Protected>
    </Stack>
  );
}
