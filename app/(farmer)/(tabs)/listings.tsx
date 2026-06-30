import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockListings } from "@/data/farmerData";
const PADDING = 16;

type FilterTab = "all" | "active" | "reserved" | "sold_out" | "archived";

export default function FarmerListings() {
  const { top } = useSafeAreaInsets();
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const statusColor = (s: string) => {
    switch (s) {
      case "active": return { bg: "#DCFCE7", text: "#15803D" };
      case "reserved": return { bg: "#DBEAFE", text: "#1D4ED8" };
      case "sold_out": return { bg: "#FEE2E2", text: "#DC2626" };
      case "vouched": return { bg: "#FEF3C7", text: "#D97706" };
      case "archived": return { bg: Colors.surfaceAlt, text: Colors.textMuted };
      case "pending": return { bg: "#F3E8FF", text: "#7C3AED" };
      default: return { bg: Colors.surfaceAlt, text: Colors.textMuted };
    }
  };

  const statusLabel = (s: string) => {
    switch (s) {
      case "sold_out": return "Sold Out";
      case "active": return "Active";
      case "reserved": return "Reserved";
      case "vouched": return "Vouched";
      case "archived": return "Archived";
      case "pending": return "Pending";
      default: return s;
    }
  };

  const filteredListings = useMemo(() => {
    if (activeFilter === "all") return mockListings;
    return mockListings.filter((l) => l.status === activeFilter);
  }, [activeFilter]);

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "reserved", label: "Reserved" },
    { key: "sold_out", label: "Sold Out" },
    { key: "archived", label: "Archived" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Header */}
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.title}>My Listings</Text>
            <Text style={s.sub}>{mockListings.length} total listing{mockListings.length !== 1 ? "s" : ""}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.addBtn}
            onPress={() => router.push("/(farmer)/create-listing")}
          >
            <Ionicons name="add" size={20} color={Colors.white} />
            <Text style={s.addBtnText}>Create</Text>
          </TouchableOpacity>
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {filterTabs.map((ft) => (
            <TouchableOpacity
              key={ft.key}
              activeOpacity={0.7}
              style={[s.filterChip, activeFilter === ft.key && s.filterChipActive]}
              onPress={() => setActiveFilter(ft.key)}
            >
              <Text style={[s.filterChipText, activeFilter === ft.key && s.filterChipTextActive]}>
                {ft.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Listing cards */}
        <View style={s.listWrap}>
          {filteredListings.length === 0 ? (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons name="leaf-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={s.emptyTitle}>No listings found</Text>
              <Text style={s.emptyDesc}>
                {activeFilter === "all"
                  ? "Tap Create to add your first listing"
                  : `No listings with status "${statusLabel(activeFilter)}"`}
              </Text>
            </View>
          ) : (
            filteredListings.map((listing) => {
              const sc = statusColor(listing.status);
              return (
                <TouchableOpacity
                  key={listing.id}
                  activeOpacity={0.8}
                  style={s.card}
                  onPress={() => router.push(`/(farmer)/listings/edit/${listing.id}`)}
                >
                  <Image source={{ uri: listing.image }} style={s.cardImg} />
                  <View style={s.cardBody}>
                    <View style={s.cardTop}>
                      <Text style={s.cardName} numberOfLines={1}>{listing.name}</Text>
                      <View style={[s.statusChip, { backgroundColor: sc.bg }]}>
                        <Text style={[s.statusChipText, { color: sc.text }]}>
                          {statusLabel(listing.status)}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.cardMeta} numberOfLines={1}>
                      {listing.type} · {listing.quantity} · ₱{listing.price}/{listing.unit}
                    </Text>
                    <View style={s.cardBottom}>
                      <Text style={s.cardSold}>{listing.totalSold} sold</Text>
                      <View style={s.scheduleRow}>
                        <Ionicons
                          name={
                            listing.scheduleTag === "market_day" ? "calendar-outline" :
                            listing.scheduleTag === "cooperative_store" ? "storefront-outline" :
                            "flag-outline"
                          }
                          size={11}
                          color={Colors.textMuted}
                        />
                        <Text style={s.scheduleText}>
                          {listing.scheduleTag === "market_day" ? "Market Day" :
                           listing.scheduleTag === "cooperative_store" ? "Coop Store" :
                           "Special Event"}
                        </Text>
                      </View>
                    </View>
                    {listing.vouched && (
                      <View style={s.vouchRow}>
                        <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                        <Text style={s.vouchText}>Coordinator Vouched</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  title: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  sub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 38,
  },
  addBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.white },
  filterRow: { paddingHorizontal: PADDING, gap: 8, marginBottom: 14 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.white },
  listWrap: { paddingHorizontal: PADDING, gap: 10 },
  card: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardImg: { width: 80, backgroundColor: Colors.surfaceAlt },
  cardBody: { flex: 1, padding: 12, justifyContent: "center" as const },
  cardTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 3,
  },
  cardName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text, flex: 1 },
  statusChip: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  statusChipText: { fontSize: 9, fontWeight: "700" as const },
  cardMeta: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  cardBottom: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
  },
  cardSold: { fontSize: 11, color: Colors.textMuted },
  scheduleRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 3 },
  scheduleText: { fontSize: 10, color: Colors.textMuted },
  vouchRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4, marginTop: 4 },
  vouchText: { fontSize: 10, fontWeight: "600" as const, color: Colors.success },
  empty: { alignItems: "center" as const, paddingTop: 60 },
  emptyIcon: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const, justifyContent: "center" as const,
    marginBottom: 14,
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, marginBottom: 4 },
  emptyDesc: { fontSize: 13, color: Colors.textMuted, textAlign: "center" as const },
};
