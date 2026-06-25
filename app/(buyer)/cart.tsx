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
import { useCart } from "@/context/CartContext";

export default function CartScreen() {
  const { top } = useSafeAreaInsets();
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
        <StatusBar barStyle="dark-content" />
        <View style={[styles.header, { paddingTop: top + 12 }]}>
          <Text style={styles.headerTitle}>Cart</Text>
        </View>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="cart-outline" size={28} color={Colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyDesc}>Browse crops and add items to your cart</Text>
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
        <Text style={styles.headerTitle}>Cart</Text>
        <Text style={styles.headerCount}>{items.length} item{items.length !== 1 ? "s" : ""}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {items.map((item) => (
          <View key={item.crop.id} style={styles.cartCard}>
            <Image source={{ uri: item.crop.image }} style={styles.cartImg} />
            <View style={styles.cartBody}>
              <View style={styles.cartTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartName} numberOfLines={1}>{item.crop.name}</Text>
                  <Text style={styles.cartFarmer}>{item.crop.farmer}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={styles.removeBtn}
                  onPress={() => removeItem(item.crop.id)}
                >
                  <Ionicons name="trash-outline" size={16} color={Colors.error} />
                </TouchableOpacity>
              </View>

              <View style={styles.cartBottom}>
                <Text style={styles.cartPrice}>₱{item.crop.price}<Text style={styles.cartUnit}>/{item.crop.unit}</Text></Text>
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

              <Text style={styles.cartSubtotal}>
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
          style={styles.checkoutBtn}
          onPress={() => router.push("/(buyer)/checkout")}
        >
          <Text style={styles.checkoutBtnText}>Checkout</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
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
  cartCard: {
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
  cartImg: {
    width: 90,
    backgroundColor: Colors.surfaceAlt,
  },
  cartBody: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between" as const,
  },
  cartTop: {
    flexDirection: "row" as const,
    alignItems: "flex-start" as const,
    gap: 8,
    marginBottom: 8,
  },
  cartName: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  cartFarmer: {
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
  cartBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 6,
  },
  cartPrice: {
    fontSize: 15,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  cartUnit: {
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
  cartSubtotal: {
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
  checkoutBtn: {
    flexDirection: "row" as const,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    paddingHorizontal: 24,
  },
  checkoutBtnText: {
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
