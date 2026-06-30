import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { crops } from "@/data/crops";
import { useReservation } from "@/context/ReservationContext";

export default function ItemDetailsScreen() {
  const { top, bottom } = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const crop = crops.find((c) => c.id === id);
  const [quantity, setQuantity] = useState(1);
  const { reserve } = useReservation();

  if (!crop) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAF9", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Crop not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: "600" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const subtotal = crop.price * quantity;

  const availColor =
    crop.availability === "In Stock"
      ? "#22C55E"
      : crop.availability === "Limited"
      ? "#F59E0B"
      : Colors.primary;

  const handleReserve = () => {
    reserve(crop, quantity);
    Alert.alert(
      "Reserved",
      `${crop.name} x ${quantity} ${crop.unit} has been reserved.`,
      [
        { text: "Continue Browsing", onPress: () => router.back() },
        { text: "View Reservations", onPress: () => router.push("/(buyer)/reservations") },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      {/* Fixed Back Button */}
      <View style={[styles.backBtnWrap, { top: top + 8 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: 220 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image */}
        <View style={[styles.heroWrap, { paddingTop: top }]}>
          <Image source={{ uri: crop.image }} style={styles.heroImage} />
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cropName}>{crop.name}</Text>
              <View style={styles.farmerRow}>
                <Ionicons name="person-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.farmerName}>{crop.farmer}</Text>
                <Text style={styles.farmerDot}>·</Text>
                <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
                <Text style={styles.farmerLoc}>{crop.location}</Text>
              </View>
            </View>
            <View style={[styles.availBadge, { backgroundColor: availColor + "15" }]}>
              <View style={[styles.availDot, { backgroundColor: availColor }]} />
              <Text style={[styles.availText, { color: availColor }]}>{crop.availability}</Text>
            </View>
          </View>
        </View>

        {/* Price */}
        <View style={styles.priceSection}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Price</Text>
            <View style={styles.priceValueRow}>
              <Text style={styles.priceValue}>₱{crop.price}</Text>
              <Text style={styles.priceUnit}> / {crop.unit}</Text>
            </View>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Available</Text>
            <Text style={styles.priceValue2}>{crop.quantity}</Text>
          </View>
          <View style={styles.priceDivider} />
          <View style={styles.priceBlock}>
            <Text style={styles.priceLabel}>Harvest</Text>
            <Text style={styles.priceValue2}>
              {new Date(crop.harvestDate).toLocaleDateString("en-PH", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>

        {/* Details */}
        <Text style={styles.sectionTitle}>Product Details</Text>
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Ionicons name="leaf-outline" size={16} color={Colors.primary} />
            <Text style={styles.detailLabel}>Type</Text>
            <Text style={styles.detailValue}>{crop.type}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="cube-outline" size={16} color={Colors.primary} />
            <Text style={styles.detailLabel}>Quantity</Text>
            <Text style={styles.detailValue}>{crop.quantity}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={16} color={Colors.primary} />
            <Text style={styles.detailLabel}>Harvest Date</Text>
            <Text style={styles.detailValue}>
              {new Date(crop.harvestDate).toLocaleDateString("en-PH", {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
          <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="location-outline" size={16} color={Colors.primary} />
            <Text style={styles.detailLabel}>Location</Text>
            <Text style={styles.detailValue}>{crop.location}</Text>
          </View>
        </View>

        {/* Farmer */}
        <Text style={styles.sectionTitle}>Sold By</Text>
        <View style={styles.farmerCard}>
          <View style={styles.farmerAvatar}>
            <Text style={styles.farmerAvatarText}>
              {crop.farmer.split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.farmerCardName}>{crop.farmer}</Text>
            <Text style={styles.farmerCardLoc}>{crop.location}</Text>
          </View>
          <TouchableOpacity style={styles.chatBtn}>
            <Ionicons name="chatbubble-outline" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: bottom + 12 }]}>
        {/* Quantity Selector */}
        <View style={styles.qtySection}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.qtyBtn}
            onPress={() => quantity > 1 && setQuantity(quantity - 1)}
          >
            <Ionicons name="remove" size={18} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.qtyValue}>{quantity}</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.qtyBtn}
            onPress={() => setQuantity(quantity + 1)}
          >
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Reserve Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.reserveBtn}
          onPress={handleReserve}
        >
          <Ionicons name="bookmark-outline" size={18} color={Colors.white} />
          <Text style={styles.reserveBtnText}>Reserve</Text>
        </TouchableOpacity>

        {/* Total */}
        <View style={styles.totalWrap}>
          <Text style={styles.totalLabel}>Estimated Total</Text>
          <Text style={styles.totalValue}>₱{subtotal.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = {
  heroWrap: {
    height: 280,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 16,
    overflow: "hidden" as const,
    marginBottom: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover" as const,
  },
  backBtnWrap: {
    position: "absolute" as const,
    left: 16,
    zIndex: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    gap: 12,
  },
  cropName: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 6,
  },
  farmerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
  },
  farmerName: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  farmerDot: {
    fontSize: 13,
    color: Colors.textMuted,
    marginHorizontal: 2,
  },
  farmerLoc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  availBadge: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  availDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  availText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  priceSection: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 0,
  },
  priceBlock: {
    flex: 1,
    alignItems: "center" as const,
  },
  priceDivider: {
    width: 1,
    backgroundColor: Colors.divider,
    marginVertical: 4,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 4,
    fontWeight: "500" as const,
  },
  priceValueRow: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
  },
  priceValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  priceUnit: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  priceValue2: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  detailsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    width: 90,
  },
  detailValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    textAlign: "right" as const,
  },
  farmerCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    gap: 14,
  },
  farmerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  farmerAvatarText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  farmerCardName: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  farmerCardLoc: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  chatBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  bottomBar: {
    position: "absolute" as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingTop: 12,
    paddingHorizontal: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 10,
    gap: 12,
  },
  qtySection: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    alignSelf: "center" as const,
    backgroundColor: Colors.primarySurface,
    borderRadius: 14,
    paddingHorizontal: 8,
    gap: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  qtyValue: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text,
    width: 36,
    textAlign: "center" as const,
  },
  reserveBtn: {
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  reserveBtnText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  totalWrap: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingTop: 4,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
};
