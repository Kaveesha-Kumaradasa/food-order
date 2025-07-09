//import { useAuth } from "@/providers/AuthProvider";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";


const _layout = () => {

  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(root)/(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="(root)/subScreens/cart" />
        <Stack.Screen name="(root)/subScreens/checkout" />
        <Stack.Screen name="(root)/subScreens/foodDetail" />

      </Stack>
    </ThemeProvider>
  );
};
export default _layout;
