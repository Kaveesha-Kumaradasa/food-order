//import { useAuth } from "@/providers/AuthProvider";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Redirect, Stack } from "expo-router";
import { View, Text, SafeAreaView, ActivityIndicator } from "react-native";

const Layout = () => {
/*  const { isLoggingIn, isAuthChecked, logout } = useAuth();

  if (isAuthChecked && !isLoggingIn) {
    console.log(isAuthChecked, isLoggingIn, "isLoggingIn");
    logout()
    return <Redirect href="/auth/welcome" />;
  }
  if (!isAuthChecked) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary" size="large" />
      </SafeAreaView>
    );
  }*/
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
        <Stack.Screen name="subScreens/cart" />
        <Stack.Screen name="subScreens/checkout" />
        <Stack.Screen name="subScreens/foodDetail" />
      </Stack>
    </ThemeProvider>
  );
};
export default Layout;


