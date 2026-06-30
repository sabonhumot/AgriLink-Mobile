import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function CoopLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="members/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="orders/[id]" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
