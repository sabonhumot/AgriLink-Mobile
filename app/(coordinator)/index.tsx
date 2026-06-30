import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  mockCoordinator,
  mockPendingFarmers,
  mockEscalatedChats,
  mockSystemActivities,
  mockMarketEvents,
} from "@/data/coordinatorData";
import { crops } from "@/data/crops";

const PADDING = 16;

export default function CoordinatorDashboard() {
  const { top } = useSafeAreaInsets();

  const pendingCount = mockPendingFarmers.filter((f) => f.status === "pending").length;
  const activeListings = crops.filter((c) => c.status === "active").length;
  const attentionListings = crops.filter((c) => c.availability === "Limited" || c.status === "sold_out").length;
  const urgentChats = mockEscalatedChats.filter((c) => c.priority === "high").length;
  const nextEvent = mockMarketEvents[0];
  const recentActivities = mockSystemActivities.slice(0, 4);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Greeting */}
        <View style={[s.greetingRow, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.greetingSub}>Welcome back,</Text>
            <Text style={s.greetingName}>{mockCoordinator.name}</Text>
            <Text style={s.greetingRole}>{mockCoordinator.cooperative}</Text>
          </View>
          <TouchableOpacity
            style={s.bellBtn}
            onPress={() => router.push("/(coordinator)/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Pending Approvals Alert */}
        {pendingCount > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.alertCard}
            onPress={() => router.push("/(coordinator)/listings")}
          >
            <View style={s.alertIconWrap}>
              <Ionicons name="people-outline" size={20} color={Colors.accent} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.alertTitle}>{pendingCount} Farmer{pendingCount !== 1 ? "s" : ""} Pending Approval</Text>
              <Text style={s.alertDesc}>Review and verify new farmer registrations</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}

        {/* Listings Oversight */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Listings Oversight</Text>
        </View>
        <View style={s.oversightGrid}>
          <View style={s.oversightCard}>
            <View style={[s.oversightIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="leaf-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={s.oversightValue}>{activeListings}</Text>
            <Text style={s.oversightLabel}>Active Listings</Text>
          </View>
          <View style={s.oversightCard}>
            <View style={[s.oversightIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={s.oversightValue}>{attentionListings}</Text>
            <Text style={s.oversightLabel}>Need Attention</Text>
          </View>
        </View>

        {/* Escalated Chats */}
        <View style={s.sectionHeader}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Text style={s.sectionTitle}>Escalated Chats</Text>
            {urgentChats > 0 && (
              <View style={s.urgentBadge}>
                <Text style={s.urgentBadgeText}>{urgentChats} urgent</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push("/(coordinator)/escalated-chats")}>
            <Text style={s.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.chatList}>
          {mockEscalatedChats.map((chat) => (
            <View key={chat.id} style={s.chatCard}>
              <View style={s.chatTop}>
                <View style={[s.priorityDot, { backgroundColor: chat.priority === "high" ? Colors.error : chat.priority === "medium" ? Colors.accent : Colors.primary }]} />
                <View style={s.chatInfo}>
                  <Text style={s.chatTitle}>{chat.farmer} ↔ {chat.buyer}</Text>
                  <Text style={s.chatIssue} numberOfLines={2}>{chat.issue}</Text>
                </View>
              </View>
              <Text style={s.chatDate}>{chat.date}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Market Events */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Upcoming Market Events</Text>
        </View>
        <View style={s.eventCard}>
          <View style={s.eventTop}>
            <View style={s.eventDateBadge}>
              <Text style={s.eventDateDay}>4</Text>
              <Text style={s.eventDateMonth}>JUL</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.eventName}>{nextEvent.name}</Text>
              <Text style={s.eventLocation}>{nextEvent.location}</Text>
            </View>
          </View>
          <Text style={s.eventDesc}>{nextEvent.description}</Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.eventBtn}
            onPress={() => router.push("/(coordinator)/listings")}
          >
            <Text style={s.eventBtnText}>Manage Event</Text>
            <Ionicons name="arrow-forward" size={14} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Recent System Activity */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Recent System Activity</Text>
        </View>
        <View style={s.activityList}>
          {recentActivities.map((act) => (
            <View key={act.id} style={s.activityItem}>
              <View style={s.activityDot} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <Text style={s.activityAction}>{act.action}</Text>
                  <Text style={s.activityDate}>{act.date}</Text>
                </View>
                <Text style={s.activityDetail}>{act.user} — {act.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  greetingRow: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
    paddingHorizontal: PADDING,
    paddingBottom: 14,
  },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 1 },
  greetingName: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  greetingRole: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  alertCard: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 12,
    marginHorizontal: PADDING,
    backgroundColor: "#FEF3C7",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },
  alertIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FDE68A",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  alertTitle: { fontSize: 14, fontWeight: "700" as const, color: "#92400E" },
  alertDesc: { fontSize: 11, color: "#A16207", marginTop: 1 },
  sectionHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    paddingHorizontal: PADDING,
    marginBottom: 10,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  oversightGrid: {
    flexDirection: "row" as const,
    paddingHorizontal: PADDING,
    gap: 10,
    marginBottom: 20,
  },
  oversightCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    alignItems: "center" as const,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  oversightIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 8,
  },
  oversightValue: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  oversightLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  urgentBadge: {
    backgroundColor: Colors.errorSurface,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  urgentBadgeText: { fontSize: 10, fontWeight: "700" as const, color: Colors.error },
  chatList: { paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  chatCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  chatTop: { flexDirection: "row" as const, gap: 10 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  chatInfo: { flex: 1 },
  chatTitle: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  chatIssue: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, lineHeight: 15 },
  chatDate: { fontSize: 10, color: Colors.textMuted, marginTop: 6, textAlign: "right" as const },
  eventCard: {
    marginHorizontal: PADDING,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  eventTop: { flexDirection: "row" as const, gap: 14, marginBottom: 10 },
  eventDateBadge: {
    width: 50,
    height: 56,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  eventDateDay: { fontSize: 20, fontWeight: "800" as const, color: Colors.primary, lineHeight: 22 },
  eventDateMonth: { fontSize: 10, fontWeight: "700" as const, color: Colors.primaryLight, letterSpacing: 0.5 },
  eventName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  eventLocation: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  eventDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 12 },
  eventBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    height: 38,
  },
  eventBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.white },
  activityList: { paddingHorizontal: PADDING, gap: 0, marginBottom: 20 },
  activityItem: {
    flexDirection: "row" as const,
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 5,
  },
  activityAction: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  activityDate: { fontSize: 10, color: Colors.textMuted },
  activityDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
};
