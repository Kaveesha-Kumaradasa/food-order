import { useAuth } from "@/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";
import { SafeAreaView, ActivityIndicator } from "react-native";

export default function Layout() {
  const { isLoggingIn, isAuthChecked, user } = useAuth();

  if (!isAuthChecked) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary" size="large" />
      </SafeAreaView>
    );
  }

  if (isAuthChecked && !user && !isLoggingIn) {
    console.log(isAuthChecked, isLoggingIn, "isLoggingIn");
    return <Redirect href="/auth/welcome" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ gestureEnabled: false }} />
      <Stack.Screen name="subScreens/cart" />
      <Stack.Screen name="subScreens/checkout" />
      <Stack.Screen name="subScreens/foodDetail" />
    </Stack>
  );
}