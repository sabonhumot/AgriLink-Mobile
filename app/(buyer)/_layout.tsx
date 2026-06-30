import { Stack } from "expo-router";

export default function BuyerLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="item" />
      <Stack.Screen name="checkout" />
    </Stack>
  );
}
