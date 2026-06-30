import { Stack } from "expo-router";
import { Colors } from "@/constants/Colors";
import { ReservationProvider } from "@/context/ReservationContext";

export default function RootLayout() {
  return (
    <ReservationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
        }}
      />
    </ReservationProvider>
  );
}
