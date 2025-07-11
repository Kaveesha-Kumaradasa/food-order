import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function Checkout() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Checkout Screen</Text>
      <Button
        title="Go to Cart"
        onPress={() => router.push("/(root)/subScreens/cart")}
      />

      <Button
        title="Back to Tabs"
        onPress={() => router.push("/(root)/(tabs)")} // Navigates back to the parent tabs
      />
    </View>
  );
}