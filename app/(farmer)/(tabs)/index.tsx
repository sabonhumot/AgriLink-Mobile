import { useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  mockFarmer,
  mockListings,
  mockFarmerOrders,
  Listing,
} from "@/data/farmerData";

const { width: SCREEN_W } = Dimensions.get("window");
const PADDING = 16;

export default function FarmerDashboard() {
  const { top } = useSafeAreaInsets();

  const activeListings = useMemo(
    () => mockListings.filter((l) => l.status === "active" || l.status === "reserved" || l.status === "vouched"),
    [],
  );

  const pendingOrders = useMemo(
    () => mockFarmerOrders.filter((o) => o.status === "Pending"),
    [],
  );

  const completedOrders = useMemo(
    () => mockFarmerOrders.filter((o) => o.status === "Delivered"),
    [],
  );

  const totalEarnings = useMemo(
    () => mockFarmerOrders.filter((o) => o.status === "Delivered").reduce((sum, o) => sum + o.totalPrice, 0),
    [],
  );

  const previewListings = useMemo(() => activeListings.slice(0, 3), [activeListings]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: top + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {mockFarmer.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.name}>{mockFarmer.name.split(" ")[0]}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push("/(farmer)/(tabs)/notifications")}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            {pendingOrders.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingOrders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="leaf-outline" size={18} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>{activeListings.length}</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="bookmark-outline" size={18} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{pendingOrders.length}</Text>
            <Text style={styles.statLabel}>Reserved Orders</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="checkmark-circle-outline" size={18} color="#15803D" />
            </View>
            <Text style={styles.statValue}>{completedOrders.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="wallet-outline" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>₱{totalEarnings.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>
        </View>

        {/* Order Notifications Badge */}
        {pendingOrders.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.orderAlert}
            onPress={() => router.push("/(farmer)/(tabs)/orders")}
          >
            <View style={styles.orderAlertIcon}>
              <Ionicons name="receipt-outline" size={20} color={Colors.white} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.orderAlertTitle}>
                {pendingOrders.length} Pending Order{pendingOrders.length > 1 ? "s" : ""}
              </Text>
              <Text style={styles.orderAlertDesc}>
                {pendingOrders.map((o) => o.buyerName).join(", ")}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* My Listings Preview */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <TouchableOpacity
            onPress={() => router.push("/(farmer)/(tabs)/listings")}
            activeOpacity={0.7}
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listingsWrap}>
          {previewListings.map((item) => (
            <ListingPreviewCard key={item.id} item={item} />
          ))}
        </View>

        {/* Upcoming Market Events */}
        <View style={styles.eventCard}>
          <View style={styles.eventIconWrap}>
            <Ionicons name="calendar-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.eventLabel}>Upcoming Market Day</Text>
            <Text style={styles.eventDate}>Saturday, July 4, 2026</Text>
            <Text style={styles.eventLoc}>Nueva Ecija Public Market</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={styles.eventBtn}>
            <Text style={styles.eventBtnText}>View</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: PADDING, marginBottom: 12 }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionCard}
            onPress={() => router.push("/(farmer)/create-listing")}
          >
            <View style={[styles.actionIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.primary} />
            </View>
            <Text style={styles.actionLabel}>Add Crop Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionCard}
            onPress={() => router.push("/(farmer)/(tabs)/listings")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="grid-outline" size={24} color="#3B82F6" />
            </View>
            <Text style={styles.actionLabel}>View All Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.actionCard}
            onPress={() => router.push("/(farmer)/(tabs)/orders")}
          >
            <View style={[styles.actionIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="chatbubble-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionLabel}>Messages</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function ListingPreviewCard({ item }: { item: Listing }) {
  const statusColor = (s: string) => {
    switch (s) {
      case "active": return { bg: "#DCFCE7", text: "#15803D" };
      case "reserved": return { bg: "#DBEAFE", text: "#1D4ED8" };
      case "vouched": return { bg: "#FEF3C7", text: "#D97706" };
      case "sold_out": return { bg: "#FEE2E2", text: "#DC2626" };
      default: return { bg: Colors.surfaceAlt, text: Colors.textMuted };
    }
  };

  const sc = statusColor(item.status);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.previewCard}
      onPress={() => router.push(`/(farmer)/listings/edit/${item.id}`)}
    >
      <Image source={{ uri: item.image }} style={styles.previewImg} />
      <View style={styles.previewBody}>
        <View style={styles.previewTop}>
          <Text style={styles.previewName} numberOfLines={1}>{item.name}</Text>
          <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.statusText, { color: sc.text }]}>
              {item.status === "sold_out" ? "Sold Out" : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={styles.previewMeta}>{item.quantity} · ₱{item.price}/{item.unit}</Text>
        <Text style={styles.previewSold}>{item.totalSold} sold</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  headerLeft: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12 },
  avatar: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  avatarText: { fontSize: 14, fontWeight: "700" as const, color: Colors.white },
  greeting: { fontSize: 12, color: Colors.textMuted },
  name: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  notifBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  badge: {
    position: "absolute" as const, top: 6, right: 6,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  badgeText: { fontSize: 9, fontWeight: "700" as const, color: Colors.white },
  statsGrid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    paddingHorizontal: PADDING,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    width: (SCREEN_W - PADDING * 2 - 10) / 2,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIcon: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center" as const, justifyContent: "center" as const,
    marginBottom: 10,
  },
  statValue: { fontSize: 20, fontWeight: "800" as const, color: Colors.text, marginBottom: 2 },
  statLabel: { fontSize: 11, color: Colors.textMuted },
  orderAlert: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.primary,
    marginHorizontal: PADDING,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
  },
  orderAlertIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  orderAlertTitle: { fontSize: 14, fontWeight: "700" as const, color: Colors.white },
  orderAlertDesc: { fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 2 },
  sectionRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 13, fontWeight: "600" as const, color: Colors.primary },
  listingsWrap: { paddingHorizontal: PADDING, gap: 10, marginBottom: 20 },
  previewCard: {
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
  previewImg: { width: 70, backgroundColor: Colors.surfaceAlt },
  previewBody: { flex: 1, padding: 12, justifyContent: "center" as const },
  previewTop: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 4,
  },
  previewName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text, flex: 1 },
  statusBadge: {
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  statusText: { fontSize: 9, fontWeight: "700" as const },
  previewMeta: { fontSize: 12, color: Colors.textSecondary, marginBottom: 2 },
  previewSold: { fontSize: 11, color: Colors.textMuted },
  eventCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.white,
    marginHorizontal: PADDING,
    borderRadius: 14,
    padding: 14,
    gap: 12,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  eventIconWrap: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  eventLabel: { fontSize: 12, fontWeight: "600" as const, color: Colors.textMuted, marginBottom: 2 },
  eventDate: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  eventLoc: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  eventBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  eventBtnText: { fontSize: 12, fontWeight: "700" as const, color: Colors.white },
  quickActions: {
    flexDirection: "row" as const,
    paddingHorizontal: PADDING,
    gap: 10,
    marginBottom: 24,
  },
  actionCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    alignItems: "center" as const,
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  actionLabel: { fontSize: 11, fontWeight: "600" as const, color: Colors.text, textAlign: "center" as const },
};
