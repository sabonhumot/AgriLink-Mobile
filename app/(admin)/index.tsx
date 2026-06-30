import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockAdmin, mockUserStats, mockSystemOverview, mockSystemLogs } from "@/data/adminData";

const PADDING = 16;

export default function AdminDashboard() {
  const { top } = useSafeAreaInsets();
  const recentLogs = mockSystemLogs.slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Greeting */}
        <View style={[s.greetingRow, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.greetingSub}>System Overview</Text>
            <Text style={s.greetingName}>{mockAdmin.name}</Text>
          </View>
          <TouchableOpacity
            style={s.bellBtn}
            onPress={() => router.push("/(admin)/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={s.statsGrid}>
          <View style={[s.statCard, { borderLeftColor: Colors.primary }]}>
            <Text style={s.statValue}>{mockUserStats.total.toLocaleString()}</Text>
            <Text style={s.statLabel}>Total Users</Text>
          </View>
          <View style={[s.statCard, { borderLeftColor: Colors.accent }]}>
            <Text style={s.statValue}>{mockSystemOverview.totalActiveListings}</Text>
            <Text style={s.statLabel}>Active Listings</Text>
          </View>
          <View style={[s.statCard, { borderLeftColor: Colors.success }]}>
            <Text style={s.statValue}>{mockSystemOverview.totalCompletedTransactions.toLocaleString()}</Text>
            <Text style={s.statLabel}>Completed Trans.</Text>
          </View>
          <View style={[s.statCard, { borderLeftColor: Colors.error }]}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
              <Text style={s.statValue}>{mockSystemOverview.pendingReports}</Text>
              <View style={s.pendingBadge}>
                <Text style={s.pendingBadgeText}>{mockSystemOverview.flaggedAccounts} flagged</Text>
              </View>
            </View>
            <Text style={s.statLabel}>Pending Reports</Text>
          </View>
        </View>

        {/* Users by Role */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Registered Users by Role</Text>
        </View>
        <View style={s.roleList}>
          {([
            { role: "Buyers", count: mockUserStats.buyers, color: Colors.primary, icon: "cart-outline" as const },
            { role: "Farmers", count: mockUserStats.farmers, color: Colors.accent, icon: "leaf-outline" as const },
            { role: "Cooperatives", count: mockUserStats.cooperatives, color: "#7C3AED", icon: "business-outline" as const },
            { role: "Coordinators", count: mockUserStats.coordinators, color: Colors.primaryLight, icon: "shield-checkmark-outline" as const },
            { role: "Admins", count: mockUserStats.admins, color: Colors.error, icon: "settings-outline" as const },
          ]).map((r) => (
            <View key={r.role} style={s.roleItem}>
              <View style={[s.roleIcon, { backgroundColor: r.color + "15" }]}>
                <Ionicons name={r.icon} size={16} color={r.color} />
              </View>
              <Text style={s.roleName}>{r.role}</Text>
              <Text style={[s.roleCount, { color: r.color }]}>{r.count.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        {/* Recent System Logs */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent System Logs</Text>
          <TouchableOpacity onPress={() => router.push("/(admin)/reports")}>
            <Text style={s.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.logList}>
          {recentLogs.map((log) => (
            <View key={log.id} style={s.logItem}>
              <View style={[s.logTypeDot, {
                backgroundColor: log.type === "error" ? Colors.error : log.type === "warning" ? Colors.accent : Colors.primary,
              }]} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={s.logAction}>{log.action}</Text>
                  <Text style={s.logDate}>{log.date}</Text>
                </View>
                <Text style={s.logDetail}>{log.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickActions}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(admin)/manage-users")}
          >
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="people-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(admin)/reports")}
          >
            <View style={[s.quickIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="document-text-outline" size={22} color={Colors.accent} />
            </View>
            <Text style={s.quickLabel}>View Reports</Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.quickBtn}
            onPress={() => router.push("/(admin)/reports")}
          >
            <View style={[s.quickIcon, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="folder-outline" size={22} color="#4338CA" />
            </View>
            <Text style={s.quickLabel}>View Logs</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  greetingRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 1 },
  greetingName: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  statsGrid: { paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  statLabel: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  pendingBadge: {
    backgroundColor: Colors.errorSurface,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  pendingBadgeText: { fontSize: 9, fontWeight: "700" as const, color: Colors.error },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  roleList: { paddingHorizontal: PADDING, gap: 6, marginBottom: 20 },
  roleItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  roleIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  roleName: { flex: 1, fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  roleCount: { fontSize: 16, fontWeight: "800" as const },
  logList: { paddingHorizontal: PADDING, gap: 0, marginBottom: 20 },
  logItem: {
    flexDirection: "row" as const,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  logTypeDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  logAction: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  logDate: { fontSize: 10, color: Colors.textMuted },
  logDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  quickActions: {
    flexDirection: "row" as const,
    paddingHorizontal: PADDING,
    gap: 10,
  },
  quickBtn: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center" as const,
    gap: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  quickIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  quickLabel: { fontSize: 11, fontWeight: "600" as const, color: Colors.textSecondary, textAlign: "center" as const },
};
