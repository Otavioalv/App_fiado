import { AppState, AppStateStatus, KeyboardAvoidingView, Platform } from "react-native";
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
import { registerForbiddenAction } from "@/src/services/api";
import { focusManager, onlineManager, QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NetInfo from "@react-native-community/netinfo";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetProvider } from "@/src/context/bottomSheetContext";

const client = new QueryClient({
  // queryCache: new QueryCache(), // verificar config
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  }
})

export default function RootLayout() {

  return (
    /* const colorScheme = useColorScheme(); / colorScheme === 'dark' ? MyDarkTheme : MyDefaultTheme */
    <ThemeProvider value={MyDefaultTheme}>
      {/* Autenticação */}
      <SessionProvider>
          {/* Verificar a ordem disso */}
          <QueryClientProvider client={client}>
            {/* Verificar ordem */}
            <GestureHandlerRootView style={{flex: 1}}>
                
                <SafeAreaProvider>
                  <SafeAreaView style={{flex:1, backgroundColor: MyDefaultTheme.colors.background}} edges={['top']}>

                    {/* Verificar ordem */}
                    <BottomSheetProvider>
      
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
                    
                    </BottomSheetProvider>
                  
                  </SafeAreaView>

                </SafeAreaProvider>

            </GestureHandlerRootView>

        </QueryClientProvider>

      </SessionProvider>
    </ThemeProvider>
  );
}


// Seguindo documentação, muda automaticamente pra tela, ao logar, ou ao abrir o app se tiver logado
function RootNavigator() {
  const {session, userType, isLoading} = useSession();
  const router = useRouter();


  const onFocusRefetch = (status: AppStateStatus) => {
    focusManager.setFocused(status === "active");
  }

  // Faz o react query verificar a rede
  useEffect(() => {
    onlineManager.setEventListener((setOnline) => {
      return NetInfo.addEventListener((state) => {
        setOnline(!!state.isConnected);
      })
    })}, 
  []);

  // Verifica status da aplicação
  useEffect(() => {
    const subscriber = AppState.addEventListener("change", onFocusRefetch);
    
    return () => subscriber.remove();
  }, []);

  // Se o usuario por algum acaso logar com token de outro tipo de usuario
  useEffect(() => {
    registerForbiddenAction(() => router.replace("/forbidden"));
  }, [router]);

  if(isLoading) return null;

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
