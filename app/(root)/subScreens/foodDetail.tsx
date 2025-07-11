import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function FoodDetail() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Food Detail Screen</Text>
      <Button
        title="Back to Tabs"
        onPress={() => router.push("/(root)/(tabs)")} // Navigates back to the parent tabs
      />
    </View>
  );
}