import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";

export default function CoordinatorLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="pending-approvals" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="create-listing-on-behalf" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="chat/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="farmer-management" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="farmer-management/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="events/index" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="events/create" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="events/edit/[id]" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="crop-info/index" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="crop-info/create" options={{ animation: "slide_from_right" }} />
      <Stack.Screen name="crop-info/edit/[id]" options={{ animation: "slide_from_right" }} />
    </Stack>
  );
}
