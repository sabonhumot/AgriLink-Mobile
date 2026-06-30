import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReservation } from "@/context/ReservationContext";

export default function ReservationsScreen() {
  const { top } = useSafeAreaInsets();
  const { items, removeItem, updateQuantity, totalPrice } = useReservation();

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: top + 12 }]}>
          <Text style={styles.headerTitle}>Reservations</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No reservations yet</Text>
          <Text style={styles.emptyDesc}>Browse crops and reserve items from local farmers</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.browseBtn}
            onPress={() => router.push("/(buyer)")}
          >
            <Text style={styles.browseBtnText}>Browse Crops</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <Text style={styles.headerTitle}>Reservations</Text>
        <Text style={styles.headerCount}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.crop.id} style={styles.card}>
            <Image source={{ uri: item.crop.image }} style={styles.cardImg} />
            <View style={styles.cardBody}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.crop.name}</Text>
                  <Text style={styles.cardFarmer}>{item.crop.farmer}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.crop.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.cardBottom}>
                <Text style={styles.cardPrice}>₱{item.crop.price}<Text style={styles.cardUnit}>/{item.crop.unit}</Text></Text>
                <View style={styles.qtyRow}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.crop.id, item.quantity - 1)}
                  >
                    <Ionicons name="remove" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                  <Text style={styles.qtyValue}>{item.quantity}</Text>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(item.crop.id, item.quantity + 1)}
                  >
                    <Ionicons name="add" size={14} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.cardSubtotal}>
                Subtotal: ₱{(item.crop.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: 16 }]}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>₱{totalPrice.toLocaleString()}</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.confirmBtn}
          onPress={() => router.push("/(buyer)/checkout")}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color={Colors.white} />
          <Text style={styles.confirmBtnText}>Confirm Reservation</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  header: {
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  headerCount: {
    fontSize: 13,
    color: Colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 12,
  },
  card: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardImg: {
    width: 90,
    backgroundColor: Colors.surfaceAlt,
  },
  cardBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between" as const,
  },
  cardTop: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    marginBottom: 8,
  },
  cardName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  cardFarmer: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.errorSurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cardBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 6,
  },
  cardPrice: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  cardUnit: {
    fontSize: 11,
    fontWeight: "500" as const,
    color: Colors.textMuted,
  },
  qtyRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  qtyValue: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    width: 28,
    textAlign: "center" as const,
  },
  cardSubtotal: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500" as const,
  },
  bottomBar: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  confirmBtn: {
    flexDirection: "row" as const,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingHorizontal: 20,
  },
  confirmBtnText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  emptyState: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    paddingBottom: 80,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 6,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
    textAlign: "center" as const,
    paddingHorizontal: 40,
  },
  browseBtn: {
    paddingHorizontal: 24,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  browseBtnText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.white,
  },
};
