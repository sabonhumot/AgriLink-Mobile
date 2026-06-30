import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useReservation } from "@/context/ReservationContext";

export default function CheckoutScreen() {
  const { top } = useSafeAreaInsets();
  const { items, totalPrice, clearReservations } = useReservation();

  const handleConfirm = () => {
    Alert.alert(
      "Reservation Confirmed",
      `Your reservation of ₱${totalPrice.toLocaleString()} has been sent to the farmer for confirmation.`,
      [
        {
          text: "OK",
          onPress: () => {
            clearReservations();
            router.replace("/(buyer)/orders");
          },
        },
      ]
    );
  };

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAF9", alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>No items to reserve</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: "600" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <TouchableOpacity activeOpacity={0.7} style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm Reservation</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Pickup Info */}
        <Text style={styles.sectionLabel}>Pickup Location</Text>
        <View style={styles.card}>
          <View style={styles.addressRow}>
            <View style={styles.addressIcon}>
              <Ionicons name="location-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressName}>Maria Santos</Text>
              <Text style={styles.addressText}>123 Rizal Avenue, Makati City</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        <View style={styles.card}>
          <View style={styles.paymentRow}>
            <View style={styles.paymentIcon}>
              <Ionicons name="cash-outline" size={20} color={Colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.paymentName}>Pay on Pickup</Text>
              <Text style={styles.paymentDesc}>Pay when you collect your reservation</Text>
            </View>
            <View style={styles.radioActive}>
              <View style={styles.radioDot} />
            </View>
          </View>
        </View>

        {/* Reservation Summary */}
        <Text style={styles.sectionLabel}>Reservation Summary</Text>
        <View style={styles.card}>
          {items.map((item, i) => (
            <View
              key={item.crop.id}
              style={[styles.summaryRow, i < items.length - 1 && styles.summaryRowBorder]}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.summaryName}>{item.crop.name}</Text>
                <Text style={styles.summaryDetail}>
                  {item.quantity} {item.crop.unit} x ₱{item.crop.price}
                </Text>
              </View>
              <Text style={styles.summaryPrice}>
                ₱{(item.crop.price * item.quantity).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Total */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>₱{totalPrice.toLocaleString()}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Pickup Fee</Text>
            <Text style={styles.totalValue}>Free</Text>
          </View>
          <View style={styles.totalDivider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalFinalLabel}>Total</Text>
            <Text style={styles.totalFinalValue}>₱{totalPrice.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      <View style={[styles.bottomBar, { paddingBottom: 16 }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.confirmBtn}
          onPress={handleConfirm}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color={Colors.white} />
          <Text style={styles.confirmBtnText}>Confirm Reservation — ₱{totalPrice.toLocaleString()}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    marginBottom: 10,
    marginTop: 8,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  addressRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  addressIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  addressName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  changeText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  paymentRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
  },
  paymentIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  paymentName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  paymentDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  radioActive: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  summaryRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
  },
  summaryRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  summaryName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  summaryDetail: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  summaryPrice: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  totalCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 6,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  totalDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 8,
  },
  totalFinalLabel: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  totalFinalValue: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmBtn: {
    flexDirection: "row" as const,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
};
