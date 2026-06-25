import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  mockFarmerOrders,
  FarmerOrder,
  FarmerOrderStatus,
} from "@/data/farmerData";

type Tab = "Pending" | "All";

export default function FarmerOrdersScreen() {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("Pending");
  const [orders, setOrders] = useState(mockFarmerOrders);

  const filtered = activeTab === "Pending"
    ? orders.filter((o) => o.status === "Pending")
    : orders;

  const pendingCount = orders.filter((o) => o.status === "Pending").length;

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Accepted" as FarmerOrderStatus } : o))
    );
    Alert.alert("Accepted", `Order ${id} has been accepted.`);
  };

  const handleReject = (id: string) => {
    Alert.alert("Reject Order", `Are you sure you want to reject ${id}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          setOrders((prev) =>
            prev.map((o) => (o.id === id ? { ...o, status: "Rejected" as FarmerOrderStatus } : o))
          );
        },
      },
    ]);
  };

  const handleDeliver = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: "Delivered" as FarmerOrderStatus } : o))
    );
  };

  const statusColor = (s: FarmerOrderStatus) => {
    if (s === "Pending") return "#F59E0B";
    if (s === "Accepted") return "#3B82F6";
    if (s === "Delivered") return "#22C55E";
    return Colors.error;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <Text style={styles.headerTitle}>Incoming Orders</Text>
        {pendingCount > 0 && (
          <Text style={styles.pendingLabel}>{pendingCount} pending</Text>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["Pending", "All"] as Tab[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.7}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabActiveText]}>
              {tab}
              {tab === "Pending" && pendingCount > 0 ? ` (${pendingCount})` : ""}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="receipt-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No orders</Text>
            <Text style={styles.emptyDesc}>
              {activeTab === "Pending" ? "No pending orders right now" : "No orders yet"}
            </Text>
          </View>
        ) : (
          filtered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              statusColor={statusColor}
              onAccept={handleAccept}
              onReject={handleReject}
              onDeliver={handleDeliver}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

function OrderCard({
  order,
  statusColor,
  onAccept,
  onReject,
  onDeliver,
}: {
  order: FarmerOrder;
  statusColor: (s: FarmerOrderStatus) => string;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onDeliver: (id: string) => void;
}) {
  const color = statusColor(order.status);

  return (
    <View style={styles.orderCard}>
      <View style={styles.orderTop}>
        <View style={styles.orderIdRow}>
          <Text style={styles.orderId}>{order.id}</Text>
          <View style={[styles.statusPill, { backgroundColor: color + "18" }]}>
            <View style={[styles.statusDot, { backgroundColor: color }]} />
            <Text style={[styles.statusText, { color }]}>{order.status}</Text>
          </View>
        </View>
        <Text style={styles.orderDate}>
          {new Date(order.date).toLocaleDateString("en-PH", {
            month: "short",
            day: "numeric",
          })}
        </Text>
      </View>

      <View style={styles.buyerRow}>
        <View style={styles.buyerAvatar}>
          <Text style={styles.buyerInitials}>
            {order.buyerName.split(" ").map((n) => n[0]).join("")}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.buyerName}>{order.buyerName}</Text>
          <Text style={styles.buyerLoc}>{order.buyerLocation}</Text>
        </View>
      </View>

      <View style={styles.itemsSection}>
        {order.items.map((item, i) => (
          <View key={i} style={styles.itemRow}>
            <Text style={styles.itemName}>{item.cropName}</Text>
            <Text style={styles.itemDetail}>
              {item.quantity} {item.unit} x ₱{item.pricePerUnit}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>₱{order.totalPrice.toLocaleString()}</Text>
      </View>

      {order.status === "Pending" && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.rejectBtn}
            onPress={() => onReject(order.id)}
          >
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.acceptBtn}
            onPress={() => onAccept(order.id)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}

      {order.status === "Accepted" && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.deliverBtn}
          onPress={() => onDeliver(order.id)}
        >
          <Ionicons name="car-outline" size={16} color={Colors.white} />
          <Text style={styles.deliverText}>Mark as Delivered</Text>
        </TouchableOpacity>
      )}
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
  pendingLabel: {
    fontSize: 13,
    color: "#F59E0B",
    fontWeight: "500" as const,
    marginTop: 2,
  },
  tabRow: {
    flexDirection: "row" as const,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  tabActiveText: {
    color: Colors.white,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 12,
  },
  orderCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  orderTop: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 12,
  },
  orderIdRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  statusPill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600" as const,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  buyerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 10,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  buyerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  buyerInitials: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  buyerLoc: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  itemsSection: {
    gap: 6,
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  itemName: {
    fontSize: 13,
    color: Colors.text,
  },
  itemDetail: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  totalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
  actionRow: {
    flexDirection: "row" as const,
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.error + "40",
    backgroundColor: Colors.errorSurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  rejectText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.error,
  },
  acceptBtn: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  deliverBtn: {
    flexDirection: "row" as const,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
  },
  deliverText: {
    fontSize: 13,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
  },
};
