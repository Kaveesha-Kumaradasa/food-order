import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Cart() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Cart Screen</Text>
      <Button
        title="Go to Checkout"
        onPress={() => router.push("/(root)/subScreens/checkout")}
      />

      <Button
        title="Back to Tabs"
        onPress={() => router.push("/(root)/(tabs)")} // Navigates back to the parent tabs
      />
    </View>
  );
}