import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crops } from "@/data/crops";

export default function CoordinatorListings() {
  const { top } = useSafeAreaInsets();
  const [vouchedIds, setVouchedIds] = useState<string[]>([]);

  const activeListings = crops.filter((c) => c.status === "active" || c.status === "sold_out");

  const handleVouch = (id: string, name: string, farmer: string) => {
    Alert.alert(
      "Vouch Listing",
      `Vouch for "${name}" by ${farmer}? The vouch badge will be visible to all buyers.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Vouch",
          onPress: () => {
            setVouchedIds((prev) => [...prev, id]);
            Alert.alert("Vouched", `${name} has been vouched.`);
          },
        },
      ],
    );
  };

  const scheduleLabel: Record<string, string> = {
    market_day: "Market Day",
    cooperative_store: "Cooperative Store",
    special_event: "Special Event",
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: top + 12, paddingBottom: 100 }}>
        <Text style={{ fontSize: 22, fontWeight: "800", color: Colors.text, marginBottom: 4 }}>Farmer Listings</Text>
        <Text style={{ fontSize: 13, color: Colors.textMuted, marginBottom: 16 }}>Review and vouch farmer listings</Text>

        {activeListings.map((listing) => {
          const isVouched = vouchedIds.includes(listing.id) || listing.vouched;
          return (
            <View key={listing.id} style={{
              backgroundColor: Colors.white, borderRadius: 14, marginBottom: 10,
              overflow: "hidden", shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <View style={{ flexDirection: "row" }}>
                <Image source={{ uri: listing.image }} style={{ width: 80, backgroundColor: Colors.surfaceAlt }} />
                <View style={{ flex: 1, padding: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.text }}>{listing.name}</Text>
                  <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 1 }}>{listing.farmer} · {listing.location}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.primary }}>₱{listing.price}/{listing.unit}</Text>
                    <View style={{ backgroundColor: Colors.surfaceAlt, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                      <Text style={{ fontSize: 9, color: Colors.textMuted }}>{listing.type}</Text>
                    </View>
                    <View style={{ backgroundColor: "#EDE9FE", borderRadius: 4, paddingHorizontal: 5, paddingVertical: 1 }}>
                      <Text style={{ fontSize: 9, color: "#7C3AED" }}>{scheduleLabel[listing.scheduleTag]}</Text>
                    </View>
                  </View>
                  {isVouched && (
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                      <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                      <Text style={{ fontSize: 10, fontWeight: "600", color: Colors.success }}>Vouched</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: Colors.divider }}>
                <View style={{ flex: 1, padding: 10, gap: 4 }}>
                  <Text style={{ fontSize: 10, color: Colors.textMuted }}>Availability</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.text }}>{listing.availability}</Text>
                </View>
                <View style={{ flex: 1, padding: 10, gap: 4 }}>
                  <Text style={{ fontSize: 10, color: Colors.textMuted }}>Harvest</Text>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: Colors.text }}>
                    {new Date(listing.harvestDate).toLocaleDateString("en-PH", { month: "short", day: "numeric" })}
                  </Text>
                </View>
                <View style={{ justifyContent: "center", paddingRight: 10 }}>
                  {isVouched ? (
                    <View style={{ backgroundColor: Colors.successSurface, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}>
                      <Text style={{ fontSize: 11, fontWeight: "700", color: Colors.success }}>Vouched</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={{ backgroundColor: Colors.primarySurface, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 }}
                      onPress={() => handleVouch(listing.id, listing.name, listing.farmer)}
                    >
                      <Text style={{ fontSize: 11, fontWeight: "700", color: Colors.primary }}>Vouch</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
