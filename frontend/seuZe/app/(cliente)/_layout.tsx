import { Stack } from "expo-router";

export default function ClienteLayout() {
  return (
    <Stack 
      initialRouteName="(tabs)"
      screenOptions={{ 
        headerShown: false,
        animation: 'none',
        // animation: "slide_from_right",
        // animationDuration: 100,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
