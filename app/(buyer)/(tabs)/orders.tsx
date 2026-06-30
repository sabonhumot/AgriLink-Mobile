import { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockOrders, Order, OrderStatus } from "@/data/buyerData";

type Tab = "active" | "history";

export default function OrdersScreen() {
  const { top } = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<Tab>("active");
  const [orders] = useState(mockOrders);
  const [showDetail, setShowDetail] = useState<Order | null>(null);

  const panY = useRef(new Animated.Value(0)).current;
  const lastTouchY = useRef(0);

  const closeDetail = () => {
    setShowDetail(null);
  };

  const onDragStart = (e: any) => {
    lastTouchY.current = e.nativeEvent.pageY;
  };

  const onDragMove = (e: any) => {
    const delta = e.nativeEvent.pageY - lastTouchY.current;
    if (delta > 0) {
      panY.setValue(delta);
    }
  };

  const onDragEnd = () => {
    const currentVal = (panY as any)._value || 0;
    if (currentVal > 120) {
      Animated.timing(panY, { toValue: 600, duration: 200, useNativeDriver: true }).start(() => closeDetail());
    } else {
      Animated.spring(panY, { toValue: 0, useNativeDriver: true }).start();
    }
  };

  const activeOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Accepted"
  );
  const historyOrders = orders.filter(
    (o) => o.status === "Delivered" || o.status === "Rejected"
  );

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Pending":
        return "#F59E0B";
      case "Accepted":
        return Colors.primary;
      case "Delivered":
        return "#22C55E";
      case "Rejected":
        return Colors.error;
    }
  };

  const viewDetail = (order: Order) => {
    setShowDetail(order);
    panY.setValue(600);
    Animated.spring(panY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 50,
      friction: 9,
    }).start();
  };

  const renderOrderCard = (order: Order) => (
    <TouchableOpacity
      key={order.id}
      activeOpacity={0.8}
      style={styles.orderCard}
      onPress={() => viewDetail(order)}
    >
      <View style={styles.orderTop}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.orderDate}>
            {new Date(order.date).toLocaleDateString("en-PH", {
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: getStatusColor(order.status) + "12" },
          ]}
        >
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(order.status) },
            ]}
          />
          <Text
            style={[styles.statusText, { color: getStatusColor(order.status) }]}
          >
            {order.status}
          </Text>
        </View>
      </View>

      <View style={styles.orderFarmerRow}>
        <Ionicons name="person-outline" size={13} color={Colors.textMuted} />
        <Text style={styles.orderFarmer}>{order.farmer}</Text>
      </View>

      <View style={styles.orderItems}>
        {order.items.map((item, i) => (
          <Text key={i} style={styles.orderItem}>
            {item.cropName}{' '}
            <Text style={styles.orderItemQty}>
              x{item.quantity} {item.unit}
            </Text>
          </Text>
        ))}
      </View>

      <View style={styles.orderBottom}>
        <Text style={styles.orderTotal}>₱{order.totalPrice.toLocaleString()}</Text>
        <Ionicons name="chevron-forward" size={16} color={Colors.iconLight} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <Text style={styles.headerTitle}>Orders</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.tab, activeTab === "active" && styles.tabActive]}
          onPress={() => setActiveTab("active")}
        >
          {activeTab === "active" && <View style={styles.tabDot} />}
          <Text
            style={[styles.tabText, activeTab === "active" && styles.tabTextActive]}
          >
            Active
          </Text>
          <View style={[styles.tabCount, activeTab === "active" && styles.tabCountActive]}>
            <Text
              style={[
                styles.tabCountText,
                activeTab === "active" && styles.tabCountTextActive,
              ]}
            >
              {activeOrders.length}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.tab, activeTab === "history" && styles.tabActive]}
          onPress={() => setActiveTab("history")}
        >
          {activeTab === "history" && <View style={styles.tabDot} />}
          <Text
            style={[styles.tabText, activeTab === "history" && styles.tabTextActive]}
          >
            History
          </Text>
          <View style={[styles.tabCount, activeTab === "history" && styles.tabCountActive]}>
            <Text
              style={[
                styles.tabCountText,
                activeTab === "history" && styles.tabCountTextActive,
              ]}
            >
              {historyOrders.length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Orders */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "active" ? (
          activeOrders.length > 0 ? (
            activeOrders.map(renderOrderCard)
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="receipt-outline" size={28} color={Colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>No active orders</Text>
              <Text style={styles.emptyDesc}>Your pending orders will appear here</Text>
            </View>
          )
        ) : historyOrders.length > 0 ? (
            historyOrders.map(renderOrderCard)
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="time-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No history yet</Text>
            <Text style={styles.emptyDesc}>Completed orders will show up here</Text>
          </View>
        )}
      </ScrollView>

      {/* Detail Modal */}
      <Modal visible={!!showDetail} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={closeDetail}
          />
          <Animated.View
            style={[styles.modalContent, { transform: [{ translateY: panY }] }]}
            onStartShouldSetResponder={() => true}
            onResponderGrant={onDragStart}
            onResponderMove={onDragMove}
            onResponderRelease={onDragEnd}
          >
            <View style={styles.modalHandle} />

            {showDetail && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>{showDetail.id}</Text>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor:
                          getStatusColor(showDetail.status) + "12",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.statusDot,
                        { backgroundColor: getStatusColor(showDetail.status) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(showDetail.status) },
                      ]}
                    >
                      {showDetail.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Farmer</Text>
                  <Text style={styles.modalInfoValue}>{showDetail.farmer}</Text>
                </View>
                <View style={styles.modalInfoRow}>
                  <Text style={styles.modalInfoLabel}>Date</Text>
                  <Text style={styles.modalInfoValue}>
                    {new Date(showDetail.date).toLocaleDateString("en-PH", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Text>
                </View>

                <View style={styles.modalDivider} />

                <Text style={styles.modalSectionTitle}>Items</Text>
                {showDetail.items.map((item, i) => (
                  <View key={i} style={styles.modalItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.modalItemName}>{item.cropName}</Text>
                      <Text style={styles.modalItemQty}>
                        {item.quantity} {item.unit} x ₱{item.pricePerUnit}
                      </Text>
                    </View>
                    <Text style={styles.modalItemTotal}>
                      ₱{(item.quantity * item.pricePerUnit).toLocaleString()}
                    </Text>
                  </View>
                ))}

                <View style={styles.modalTotalRow}>
                  <Text style={styles.modalTotalLabel}>Total</Text>
                  <Text style={styles.modalTotalValue}>
                    ₱{showDetail.totalPrice.toLocaleString()}
                  </Text>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
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
  tabRow: {
    flexDirection: "row" as const,
    paddingHorizontal: 20,
    gap: 8,
    marginBottom: 4,
  },
  tab: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
    gap: 6,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.white,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: Colors.white,
  },
  tabCount: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: Colors.surfaceAlt,
  },
  tabCountActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  tabCountText: {
    fontSize: 11,
    fontWeight: "700" as const,
    color: Colors.textMuted,
  },
  tabCountTextActive: {
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
    alignItems: "flex-start" as const,
    marginBottom: 10,
  },
  orderId: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  orderDate: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  statusPill: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600" as const,
  },
  orderFarmerRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 5,
    marginBottom: 10,
  },
  orderFarmer: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  orderItems: {
    gap: 4,
    marginBottom: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  orderItem: {
    fontSize: 13,
    color: Colors.text,
  },
  orderItemQty: {
    color: Colors.textMuted,
  },
  orderBottom: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  orderTotal: {
    fontSize: 17,
    fontWeight: "800" as const,
    color: Colors.primary,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "flex-end" as const,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: "center" as const,
    marginBottom: 20,
  },
  modalHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  modalInfoRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    marginBottom: 8,
  },
  modalInfoLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  modalInfoValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  modalDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 16,
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  modalItemRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  modalItemName: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
    marginBottom: 2,
  },
  modalItemQty: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  modalItemTotal: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  modalTotalRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: Colors.primary,
  },
  modalTotalLabel: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  modalTotalValue: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.primary,
  },
};
