import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopTransactions } from "@/data/coopData";

const PADDING = 16;

export default function CoopOrders() {
  const { top } = useSafeAreaInsets();
  const [filter, setFilter] = useState<"all" | "completed" | "pending" | "cancelled">("all");

  const filtered = useMemo(() => {
    if (filter === "all") return mockCoopTransactions;
    return mockCoopTransactions.filter((t) => t.status === filter);
  }, [filter]);

  const statusColor = (s: string) => {
    switch (s) {
      case "completed": return { bg: "#DCFCE7", text: "#15803D" };
      case "pending": return { bg: "#FEF3C7", text: "#D97706" };
      case "cancelled": return { bg: "#FEE2E2", text: "#DC2626" };
      default: return { bg: Colors.surfaceAlt, text: Colors.textMuted };
    }
  };

  const filterTabs = [
    { key: "all" as const, label: "All" },
    { key: "completed" as const, label: "Completed" },
    { key: "pending" as const, label: "Pending" },
    { key: "cancelled" as const, label: "Cancelled" },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <Text style={s.title}>Transactions</Text>
          <Text style={s.sub}>{mockCoopTransactions.length} total</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {filterTabs.map((ft) => (
            <TouchableOpacity
              key={ft.key}
              activeOpacity={0.7}
              style={[s.filterChip, filter === ft.key && s.filterChipActive]}
              onPress={() => setFilter(ft.key)}
            >
              <Text style={[s.filterChipText, filter === ft.key && s.filterChipTextActive]}>
                {ft.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={s.list}>
          {filtered.map((trx) => {
            const sc = statusColor(trx.status);
            return (
              <TouchableOpacity key={trx.id} activeOpacity={0.7} style={s.card} onPress={() => router.push(`/(coop)/orders/${trx.id}`)}>
                <View style={s.cardTop}>
                  <View style={s.cardLeft}>
                    <View style={[s.dot, { backgroundColor: sc.text }]} />
                    <View>
                      <Text style={s.cropName}>{trx.crop}</Text>
                      <Text style={s.cropDetail}>{trx.farmerName} → {trx.buyerName}</Text>
                    </View>
                  </View>
                  <Text style={s.amount}>₱{trx.totalAmount}</Text>
                </View>
                <View style={s.cardBottom}>
                  <Text style={s.date}>{trx.date} · {trx.quantity}</Text>
                  <View style={[s.badge, { backgroundColor: sc.bg }]}>
                    <Text style={[s.badgeText, { color: sc.text }]}>
                      {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  header: { paddingHorizontal: PADDING, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  sub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  filterRow: { paddingHorizontal: PADDING, gap: 8, marginBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.white },
  list: { paddingHorizontal: PADDING, gap: 8 },
  card: { backgroundColor: Colors.white, borderRadius: 14, padding: 14, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  cardTop: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, marginBottom: 8 },
  cardLeft: { flexDirection: "row" as const, gap: 10, flex: 1 },
  dot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  cropName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  cropDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: "800" as const, color: Colors.text },
  cardBottom: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const },
  date: { fontSize: 11, color: Colors.textMuted },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  badgeText: { fontSize: 10, fontWeight: "700" as const },
};
