import { useState } from "react";
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
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFarmer, mockListings, Listing } from "@/data/farmerData";

const { width: SCREEN_W } = Dimensions.get("window");
const PADDING = 16;
const CARD_GAP = 12;
const GRID_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_W - PADDING * 2 - CARD_GAP) / GRID_COLUMNS;

export default function FarmerDashboard() {
  const { top } = useSafeAreaInsets();
  const [listings] = useState(mockListings);

  const totalRevenue = listings.reduce((sum, l) => sum + l.totalSold * l.price, 0);
  const totalStock = listings.reduce((sum, l) => {
    const num = parseInt(l.quantity, 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: top + 8 }]}>
          <View style={styles.headerLeft}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Welcome back</Text>
              <Text style={styles.name}>{mockFarmer.name.split(" ")[0]}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications-outline" size={20} color={Colors.text} />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="wallet-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={styles.statValue}>₱{totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="cube-outline" size={20} color="#3B82F6" />
            </View>
            <Text style={styles.statValue}>{totalStock} kg</Text>
            <Text style={styles.statLabel}>In Stock</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconWrap, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="leaf-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.statValue}>{listings.length}</Text>
            <Text style={styles.statLabel}>Listings</Text>
          </View>
        </View>

        {/* My Listings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <Text style={styles.sectionCount}>{listings.length} items</Text>
        </View>

        <View style={styles.grid}>
          {listings.map((item) => (
            <ListingCard key={item.id} item={item} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ListingCard({ item }: { item: Listing }) {
  const availColor =
    item.availability === "In Stock"
      ? "#22C55E"
      : item.availability === "Limited"
      ? "#F59E0B"
      : Colors.primary;

  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.gridCard}>
      <Image source={{ uri: item.image }} style={styles.gridImg} />
      <View style={styles.gridBody}>
        <View style={styles.availRow}>
          <View style={[styles.dot, { backgroundColor: availColor }]} />
          <Text style={styles.availText}>{item.availability}</Text>
        </View>
        <Text style={styles.cropName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cropQty}>{item.quantity}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.cropPrice}>₱{item.price}<Text style={styles.cropUnit}>/{item.unit}</Text></Text>
          <Text style={styles.soldText}>{item.totalSold} sold</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = {
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  greeting: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  name: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  badge: {
    position: "absolute" as const,
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  statsRow: {
    flexDirection: "row" as const,
    paddingHorizontal: PADDING,
    gap: CARD_GAP,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    alignItems: "center" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  sectionCount: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  grid: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    paddingHorizontal: PADDING,
    gap: CARD_GAP,
  },
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: "hidden" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  gridImg: {
    width: "100%",
    height: 100,
    backgroundColor: Colors.surfaceAlt,
  },
  gridBody: {
    padding: 10,
  },
  availRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    marginBottom: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  cropName: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  cropQty: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  cropPrice: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  cropUnit: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.textMuted,
  },
  soldText: {
    fontSize: 10,
    color: Colors.textMuted,
  },
};
