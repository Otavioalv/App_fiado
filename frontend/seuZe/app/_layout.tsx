import { KeyboardAvoidingView, Platform } from "react-native";
import { Slot } from "expo-router";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { ThemeProvider } from "@react-navigation/native";
import { MyDefaultTheme } from "@/src/constants/theme";
// import * as NavigationBar from "expo-navigation-bar"
// import { useEffect } from "react";

export default function RootLayout() {
  
  // useEffect(() => {
  //   if (Platform.OS === 'android') {
  //     NavigationBar.setBackgroundColorAsync("red"); 
  //     NavigationBar.setButtonStyleAsync("dark");
  //   }
  // }, []);

  return (
    /* const colorScheme = useColorScheme(); / colorScheme === 'dark' ? MyDarkTheme : MyDefaultTheme */
    <ThemeProvider value={MyDefaultTheme}>
      <SafeAreaProvider>
        <SafeAreaView style={{flex:1, backgroundColor: MyDefaultTheme.colors.background}} edges={['top', 'bottom']}>

          <KeyboardAvoidingView
            style={{ flex: 1}}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <Slot/>
            <StatusBar style="dark"/>   
          </KeyboardAvoidingView>
        </SafeAreaView>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
