import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopTransactions } from "@/data/coopData";

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();

  const trx = mockCoopTransactions.find((t) => t.id === id);

  if (!trx) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Transaction not found</Text>
      </View>
    );
  }

  const sc = {
    completed: { bg: "#DCFCE7", text: "#15803D", icon: "checkmark-circle" as const },
    pending: { bg: "#FEF3C7", text: "#D97706", icon: "time-outline" as const },
    cancelled: { bg: "#FEE2E2", text: "#DC2626", icon: "close-circle" as const },
  }[trx.status];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.backRow, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Transaction Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={s.statusCard}>
          <Ionicons name={sc.icon} size={40} color={sc.text} />
          <Text style={[s.statusText, { color: sc.text }]}>
            {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
          </Text>
          <Text style={s.trxId}>ID: {trx.id}</Text>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="leaf-outline" size={16} color={Colors.primary} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Crop</Text>
              <Text style={s.infoValue}>{trx.crop}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="scale-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Quantity</Text>
              <Text style={s.infoValue}>{trx.quantity}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="cash-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Total Amount</Text>
              <Text style={s.infoValue}>₱{trx.totalAmount.toLocaleString()}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="person-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Farmer</Text>
              <Text style={s.infoValue}>{trx.farmerName}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="cart-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Buyer</Text>
              <Text style={s.infoValue}>{trx.buyerName}</Text>
            </View>
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Date</Text>
              <Text style={s.infoValue}>{trx.date}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  backRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "700" as const, color: Colors.text },
  statusCard: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 20, padding: 24, alignItems: "center" as const, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  statusText: { fontSize: 18, fontWeight: "800" as const, marginTop: 8 },
  trxId: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },
  infoCard: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 24, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: 11, color: Colors.textMuted },
  infoValue: { fontSize: 14, color: Colors.text, marginTop: 1 },
};
