import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crops, cropTypes } from "@/data/crops";
import { mockBuyer } from "@/data/buyerData";


const PADDING = 16;
const FEATURED_CARD_W = 160;

export default function BuyerHomeScreen() {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  const activeCrops = useMemo(() => crops.filter((c) => c.status === "active"), []);

  const featuredCrops = useMemo(
    () => [...activeCrops].sort((a, b) => new Date(b.harvestDate).getTime() - new Date(a.harvestDate).getTime()).slice(0, 6),
    [activeCrops],
  );

  const nextEvent = {
    name: "Benguet Farmers Market Day",
    date: "July 4, 2026",
    location: "La Trinidad Municipal Plaza",
    description: "Fresh organic vegetables, fruits, and grains from Benguet farmers.",
  };

  const nearbyFarms = [
    { name: "Barangay Central", farms: 4, color: Colors.primary },
    { name: "San Isidro", farms: 3, color: Colors.accent },
    { name: "Sto. Rosario", farms: 2, color: Colors.primaryLight },
    { name: "San Vicente", farms: 5, color: Colors.primary },
    { name: "Santa Lucia", farms: 1, color: Colors.accentLight },
  ];

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/(buyer)/item?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleTypePress = (type: string) => {
    router.push(`/(buyer)/item?type=${encodeURIComponent(type)}`);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Greeting */}
        <View style={[s.greetingRow, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.greetingSub}>Good morning,</Text>
            <Text style={s.greetingName}>{mockBuyer.name}</Text>
          </View>
          <TouchableOpacity
            style={s.bellBtn}
            onPress={() => router.push("/(buyer)/(tabs)/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={s.searchWrap}>
          <View style={s.search}>
            <Ionicons name="search" size={16} color={Colors.textMuted} />
            <TextInput
              style={s.searchInput}
              placeholder="Search crops, farmers, locations..."
              placeholderTextColor={Colors.placeholder}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              onSubmitEditing={handleSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            )}
            <View style={s.searchDivider} />
            <TouchableOpacity onPress={() => router.push("/(buyer)/item")} activeOpacity={0.7}>
              <Ionicons name="camera-outline" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Browse by Category */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Browse by Category</Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.categoryRow}
        >
          {cropTypes.map((type) => (
            <TouchableOpacity
              key={type}
              activeOpacity={0.7}
              style={s.categoryCard}
              onPress={() => handleTypePress(type)}
            >
              <View style={s.categoryIconWrap}>
                <Ionicons
                  name={
                    type === "Rice" ? "nutrition-outline" :
                    type === "Corn" ? "leaf-outline" :
                    type === "Vegetables" ? "leaf-outline" :
                    type === "Fruits" ? "nutrition-outline" :
                    type === "Root Crops" ? "git-branch-outline" :
                    "flask-outline"
                  }
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <Text style={s.categoryLabel} numberOfLines={1}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Upcoming Market Events */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Upcoming Market Events</Text>
        </View>
        <View style={s.eventCard}>
          <View style={s.eventTop}>
            <View style={s.eventDateBadge}>
              <Text style={s.eventDateDay}>4</Text>
              <Text style={s.eventDateMonth}>JUL</Text>
            </View>
            <View style={s.eventInfo}>
              <Text style={s.eventName}>{nextEvent.name}</Text>
              <View style={s.eventMetaRow}>
                <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
                <Text style={s.eventMetaText}>{nextEvent.location}</Text>
              </View>
            </View>
          </View>
          <Text style={s.eventDesc}>{nextEvent.description}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.eventBtn}
            onPress={() => router.push("/(buyer)/item")}
          >
            <Text style={s.eventBtnText}>View Event</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Featured Listings */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Featured Listings</Text>
          <TouchableOpacity onPress={() => router.push("/(buyer)/item")}>
            <Text style={s.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.featuredRow}
        >
          {featuredCrops.map((crop) => (
            <TouchableOpacity
              key={crop.id}
              activeOpacity={0.9}
              style={s.featuredCard}
              onPress={() => router.push(`/(buyer)/item?id=${crop.id}`)}
            >
              <Image source={{ uri: crop.image }} style={s.featuredImg} />
              <View style={s.featuredBody}>
                <View style={s.featuredTagRow}>
                  {crop.vouched && (
                    <View style={s.featuredVouch}>
                      <Ionicons name="checkmark-circle" size={9} color={Colors.white} />
                      <Text style={s.featuredVouchText}>Vouch</Text>
                    </View>
                  )}
                </View>
                <Text style={s.featuredName} numberOfLines={1}>{crop.name}</Text>
                <Text style={s.featuredFarmer} numberOfLines={1}>{crop.farmer}</Text>
                <Text style={s.featuredPrice}>
                  ₱{crop.price}
                  <Text style={s.featuredUnit}> / {crop.unit}</Text>
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Nearby Farms */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Nearby Farms</Text>
        </View>
        <View style={s.mapCard}>
          <View style={s.mapGrid}>
            {nearbyFarms.map((area, i) => {
              const dots = Math.min(area.farms, 6);
              return (
                <View key={i} style={s.mapRow}>
                  <Text style={s.mapLabel}>{area.name}</Text>
                  <View style={s.mapDots}>
                    {Array.from({ length: dots }).map((_, di) => (
                      <View key={di} style={[s.mapDot, { backgroundColor: area.color }]} />
                    ))}
                  </View>
                  <Text style={s.mapCount}>{area.farms} farm{area.farms !== 1 ? "s" : ""}</Text>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.mapViewBtn}
            onPress={() => router.push("/(buyer)/item")}
          >
            <Ionicons name="map-outline" size={16} color={Colors.primary} />
            <Text style={s.mapViewText}>View Full Map</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(buyer)/item")}
          >
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="leaf-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>Browse All Crops</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(buyer)/item")}
          >
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="camera-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>Image Search</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(buyer)/item")}
          >
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="map-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>View Map</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  greetingRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 1 },
  greetingName: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  searchWrap: { paddingHorizontal: PADDING, marginBottom: 16 },
  search: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 44,
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  searchDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  categoryRow: { paddingHorizontal: PADDING, gap: 10, marginBottom: 20 },
  categoryCard: {
    alignItems: "center" as const,
    gap: 6,
    width: 72,
  },
  categoryIconWrap: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  categoryLabel: { fontSize: 11, fontWeight: "600" as const, color: Colors.textSecondary, textAlign: "center" as const },
  eventCard: {
    marginHorizontal: PADDING,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  eventTop: { flexDirection: "row" as const, gap: 14, marginBottom: 10 },
  eventDateBadge: {
    width: 50,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  eventDateDay: { fontSize: 20, fontWeight: "800" as const, color: Colors.primary, lineHeight: 22 },
  eventDateMonth: { fontSize: 10, fontWeight: "700" as const, color: Colors.primaryLight, letterSpacing: 0.5 },
  eventInfo: { flex: 1, justifyContent: "center" as const },
  eventName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text, marginBottom: 3 },
  eventMetaRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4 },
  eventMetaText: { fontSize: 11, color: Colors.textMuted },
  eventDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 12 },
  eventBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 38,
  },
  eventBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.white },
  featuredRow: { paddingHorizontal: PADDING, gap: 10, marginBottom: 20 },
  featuredCard: {
    width: FEATURED_CARD_W,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  featuredImg: { width: FEATURED_CARD_W, height: 90, backgroundColor: Colors.surfaceAlt },
  featuredBody: { padding: 10 },
  featuredTagRow: { flexDirection: "row" as const, gap: 4, marginBottom: 4, minHeight: 15 },
  featuredVouch: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 2,
    backgroundColor: Colors.success,
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  featuredVouchText: { fontSize: 8, fontWeight: "700" as const, color: Colors.white },
  featuredName: { fontSize: 12, fontWeight: "700" as const, color: Colors.text, marginBottom: 1 },
  featuredFarmer: { fontSize: 10, color: Colors.textMuted, marginBottom: 4 },
  featuredPrice: { fontSize: 14, fontWeight: "800" as const, color: Colors.primary },
  featuredUnit: { fontSize: 10, fontWeight: "500" as const, color: Colors.textMuted },
  mapCard: {
    marginHorizontal: PADDING,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  mapGrid: { gap: 10, marginBottom: 14 },
  mapRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  mapLabel: { width: 100, fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  mapDots: { flexDirection: "row" as const, gap: 5, flex: 1 },
  mapDot: { width: 8, height: 8, borderRadius: 4 },
  mapCount: { fontSize: 11, color: Colors.textMuted, width: 55, textAlign: "right" as const },
  mapViewBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: 10,
    height: 38,
  },
  mapViewText: { fontSize: 13, fontWeight: "700" as const, color: Colors.primary },
  quickActions: {
    flexDirection: "row" as const,
    paddingHorizontal: PADDING,
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center" as const,
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  quickLabel: { fontSize: 11, fontWeight: "600" as const, color: Colors.textSecondary, textAlign: "center" as const },
};
