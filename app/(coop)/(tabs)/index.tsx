import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopProfile, mockCoopTransactions, mockCoopMembers } from "@/data/coopData";

const PADDING = 16;

export default function CoopDashboard() {
  const { top } = useSafeAreaInsets();

  const activeMembers = mockCoopMembers.filter((m) => m.status === "active").length;
  const pendingOrders = mockCoopTransactions.filter((t) => t.status === "pending").length;
  const totalRevenue = mockCoopTransactions.filter((t) => t.status === "completed").reduce((sum, t) => sum + t.totalAmount, 0);
  const recentTrx = mockCoopTransactions.slice(0, 3);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Greeting */}
        <View style={[s.greetingRow, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.greetingSub}>Welcome back,</Text>
            <Text style={s.greetingName}>{mockCoopProfile.name}</Text>
            <Text style={s.greetingRole}>Cooperative</Text>
          </View>
          <TouchableOpacity
            style={s.bellBtn}
            onPress={() => router.push("/(coop)/(tabs)/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Stats Grid */}
        <View style={s.statsGrid}>
          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={s.statValue}>{activeMembers}</Text>
            <Text style={s.statLabel}>Active Members</Text>
          </View>
          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="receipt-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={s.statValue}>{pendingOrders}</Text>
            <Text style={s.statLabel}>Pending Orders</Text>
          </View>
          <View style={s.statCard}>
            <View style={[s.statIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="cash-outline" size={20} color={Colors.success} />
            </View>
            <Text style={s.statValue}>₱{totalRevenue.toLocaleString()}</Text>
            <Text style={s.statLabel}>Total Revenue</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickGrid}>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coop)/(tabs)/members")}>
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="person-add-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>Manage Members</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coop)/(tabs)/orders")}>
            <View style={[s.quickIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="receipt-outline" size={22} color={Colors.accent} />
            </View>
            <Text style={s.quickLabel}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coop)/(tabs)/profile")}>
            <View style={[s.quickIcon, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="settings-outline" size={22} color="#4338CA" />
            </View>
            <Text style={s.quickLabel}>Coop Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Cooperative Info */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Cooperative Info</Text>
        </View>
        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
            <Text style={s.infoText}>{mockCoopProfile.address}</Text>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="call-outline" size={16} color={Colors.textMuted} />
            <Text style={s.infoText}>{mockCoopProfile.phone}</Text>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="mail-outline" size={16} color={Colors.textMuted} />
            <Text style={s.infoText}>{mockCoopProfile.email}</Text>
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <Text style={s.infoText}>Founded {mockCoopProfile.foundingDate}</Text>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push("/(coop)/(tabs)/orders")}>
            <Text style={s.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.trxList}>
          {recentTrx.map((trx) => (
            <TouchableOpacity key={trx.id} activeOpacity={0.7} style={s.trxCard} onPress={() => router.push(`/(coop)/orders/${trx.id}`)}>
              <View style={s.trxLeft}>
                <View style={[s.trxStatusDot, { backgroundColor: trx.status === "completed" ? Colors.success : trx.status === "pending" ? Colors.accent : Colors.error }]} />
                <View style={{ flex: 1 }}>
                  <Text style={s.trxCrop}>{trx.crop}</Text>
                  <Text style={s.trxDetail}>{trx.farmerName} → {trx.buyerName}</Text>
                  <Text style={s.trxDate}>{trx.date} · {trx.quantity}</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={s.trxAmount}>₱{trx.totalAmount}</Text>
                <Text style={[s.trxStatusText, { color: trx.status === "completed" ? Colors.success : trx.status === "pending" ? Colors.accent : Colors.error }]}>
                  {trx.status.charAt(0).toUpperCase() + trx.status.slice(1)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Member Overview */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Member Overview</Text>
          <TouchableOpacity onPress={() => router.push("/(coop)/(tabs)/members")}>
            <Text style={s.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.memberSummary}>
          {mockCoopMembers.slice(0, 4).map((m) => (
            <TouchableOpacity key={m.id} activeOpacity={0.7} style={s.memberRow} onPress={() => router.push(`/(coop)/members/${m.id}`)}>
              <View style={s.memberAvatar}>
                <Text style={s.memberAvatarText}>{m.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.memberName}>{m.name}</Text>
                <Text style={s.memberBarangay}>{m.barangay} · {m.farmSize}</Text>
              </View>
              <View style={[s.memberStatusDot, { backgroundColor: m.status === "active" ? Colors.success : Colors.textMuted }]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  greetingRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, paddingHorizontal: PADDING, paddingBottom: 14 },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 1 },
  greetingName: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  greetingRole: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  bellBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  statsGrid: { flexDirection: "row" as const, paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: "center" as const, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 6 },
  statValue: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 1, textAlign: "center" as const },
  sectionHeader: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, paddingHorizontal: PADDING, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  quickGrid: { flexDirection: "row" as const, paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  quickCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: "center" as const, gap: 6, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  quickIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center" as const, justifyContent: "center" as const },
  quickLabel: { fontSize: 10, fontWeight: "600" as const, color: Colors.textSecondary, textAlign: "center" as const },
  infoCard: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 20, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoText: { fontSize: 13, color: Colors.textSecondary, flex: 1 },
  trxList: { paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  trxCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  trxLeft: { flexDirection: "row" as const, gap: 10, flex: 1 },
  trxStatusDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  trxCrop: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  trxDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  trxDate: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  trxAmount: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  trxStatusText: { fontSize: 10, fontWeight: "600" as const, marginTop: 2 },
  memberSummary: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 20, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  memberRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  memberAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  memberAvatarText: { fontSize: 14, fontWeight: "700" as const, color: Colors.primary },
  memberName: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  memberBarangay: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  memberStatusDot: { width: 8, height: 8, borderRadius: 4 },
};
