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
  const nextEvent = mockMarketEvents.find((e) => e.status === "upcoming");
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
            onPress={() => router.push("/(coordinator)/(tabs)/notifications")}
          >
            <Ionicons name="notifications-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Pending Approvals Alert */}
        {pendingCount > 0 && (
          <TouchableOpacity
            activeOpacity={0.8}
            style={s.alertCard}
            onPress={() => router.push("/(coordinator)/pending-approvals")}
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
          <TouchableOpacity activeOpacity={0.7} style={s.oversightCard} onPress={() => router.push("/(coordinator)/(tabs)/listings")}>
            <View style={[s.oversightIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="leaf-outline" size={20} color={Colors.primary} />
            </View>
            <Text style={s.oversightValue}>{activeListings}</Text>
            <Text style={s.oversightLabel}>Active Listings</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={s.oversightCard} onPress={() => router.push("/(coordinator)/(tabs)/listings")}>
            <View style={[s.oversightIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.accent} />
            </View>
            <Text style={s.oversightValue}>{attentionListings}</Text>
            <Text style={s.oversightLabel}>Need Attention</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>Quick Actions</Text>
        </View>
        <View style={s.quickGrid}>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coordinator)/pending-approvals")}>
            <View style={[s.quickIcon, { backgroundColor: "#FEF3C7" }]}>
              <Ionicons name="people-outline" size={22} color={Colors.accent} />
            </View>
            <Text style={s.quickLabel}>Pending Approvals</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coordinator)/create-listing-on-behalf")}>
            <View style={[s.quickIcon, { backgroundColor: Colors.primarySurface }]}>
              <Ionicons name="add-circle-outline" size={22} color={Colors.primary} />
            </View>
            <Text style={s.quickLabel}>Create Listing</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coordinator)/events/index")}>
            <View style={[s.quickIcon, { backgroundColor: "#E0E7FF" }]}>
              <Ionicons name="calendar-outline" size={22} color="#4338CA" />
            </View>
            <Text style={s.quickLabel}>Manage Events</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coordinator)/farmer-management")}>
            <View style={[s.quickIcon, { backgroundColor: "#DCFCE7" }]}>
              <Ionicons name="person-outline" size={22} color={Colors.success} />
            </View>
            <Text style={s.quickLabel}>Farmers</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.8} style={s.quickCard} onPress={() => router.push("/(coordinator)/crop-info/index")}>
            <View style={[s.quickIcon, { backgroundColor: "#F3E8FF" }]}>
              <Ionicons name="book-outline" size={22} color="#7C3AED" />
            </View>
            <Text style={s.quickLabel}>Crop Info</Text>
          </TouchableOpacity>
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
          <TouchableOpacity onPress={() => router.push("/(coordinator)/(tabs)/escalated-chats")}>
            <Text style={s.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        <View style={s.chatList}>
          {mockEscalatedChats.slice(0, 2).map((chat) => (
            <TouchableOpacity key={chat.id} activeOpacity={0.7} style={s.chatCard} onPress={() => router.push(`/(coordinator)/chat/${chat.id}`)}>
              <View style={s.chatTop}>
                <View style={[s.priorityDot, { backgroundColor: chat.priority === "high" ? Colors.error : chat.priority === "medium" ? Colors.accent : Colors.primary }]} />
                <View style={s.chatInfo}>
                  <Text style={s.chatTitle}>{chat.farmer} ↔ {chat.buyer}</Text>
                  <Text style={s.chatIssue} numberOfLines={1}>{chat.issue}</Text>
                </View>
              </View>
              <View style={s.chatBottom}>
                <Text style={s.chatDate}>{chat.date}</Text>
                <Text style={[s.chatStatus, { color: chat.status === "open" ? Colors.accent : Colors.success }]}>
                  {chat.status === "open" ? "Open" : "Resolved"}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Upcoming Market Events */}
        {nextEvent && (
          <>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Upcoming Market Events</Text>
              <TouchableOpacity onPress={() => router.push("/(coordinator)/events/index")}>
                <Text style={s.seeAllText}>Manage</Text>
              </TouchableOpacity>
            </View>
            <View style={s.eventCard}>
              <View style={s.eventTop}>
                <View style={s.eventDateBadge}>
                  <Text style={s.eventDateDay}>{new Date(nextEvent.date).getDate()}</Text>
                  <Text style={s.eventDateMonth}>{new Date(nextEvent.date).toLocaleString("en-PH", { month: "short" }).toUpperCase()}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.eventName}>{nextEvent.name}</Text>
                  <Text style={s.eventLocation}>{nextEvent.location}</Text>
                  <Text style={s.eventMeta}>{nextEvent.type} · {nextEvent.farmerCount} farmers</Text>
                </View>
              </View>
              <Text style={s.eventDesc}>{nextEvent.description}</Text>
              <TouchableOpacity
                activeOpacity={0.8}
                style={s.eventBtn}
                onPress={() => router.push(`/(coordinator)/events/edit/${nextEvent.id}`)}
              >
                <Text style={s.eventBtnText}>Manage Event</Text>
                <Ionicons name="arrow-forward" size={14} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </>
        )}

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
  greetingRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "flex-start" as const, paddingHorizontal: PADDING, paddingBottom: 14 },
  greetingSub: { fontSize: 13, color: Colors.textMuted, marginBottom: 1 },
  greetingName: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  greetingRole: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  bellBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  alertCard: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, marginHorizontal: PADDING, backgroundColor: "#FEF3C7", borderRadius: 14, padding: 14, marginBottom: 20 },
  alertIconWrap: { width: 40, height: 40, borderRadius: 12, backgroundColor: "#FDE68A", alignItems: "center" as const, justifyContent: "center" as const },
  alertTitle: { fontSize: 14, fontWeight: "700" as const, color: "#92400E" },
  alertDesc: { fontSize: 11, color: "#A16207", marginTop: 1 },
  sectionHeader: { flexDirection: "row" as const, justifyContent: "space-between" as const, alignItems: "center" as const, paddingHorizontal: PADDING, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  seeAllText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  oversightGrid: { flexDirection: "row" as const, paddingHorizontal: PADDING, gap: 10, marginBottom: 16 },
  oversightCard: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, padding: 16, alignItems: "center" as const, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  oversightIcon: { width: 42, height: 42, borderRadius: 12, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 8 },
  oversightValue: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  oversightLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  quickGrid: { flexDirection: "row" as const, flexWrap: "wrap" as const, paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  quickCard: { width: (PADDING === 16 ? 0 : 0) || (370 - 16 * 2 - 8 * 2) / 3, backgroundColor: Colors.white, borderRadius: 14, padding: 12, alignItems: "center" as const, gap: 6, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, flex: 1, minWidth: 70 },
  quickIcon: { width: 36, height: 36, borderRadius: 10, alignItems: "center" as const, justifyContent: "center" as const },
  quickLabel: { fontSize: 10, fontWeight: "600" as const, color: Colors.textSecondary, textAlign: "center" as const },
  urgentBadge: { backgroundColor: Colors.errorSurface, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  urgentBadgeText: { fontSize: 10, fontWeight: "700" as const, color: Colors.error },
  chatList: { paddingHorizontal: PADDING, gap: 8, marginBottom: 20 },
  chatCard: { backgroundColor: Colors.white, borderRadius: 12, padding: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  chatTop: { flexDirection: "row" as const, gap: 10 },
  priorityDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5 },
  chatInfo: { flex: 1 },
  chatTitle: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  chatIssue: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  chatBottom: { flexDirection: "row" as const, justifyContent: "space-between" as const, marginTop: 6 },
  chatDate: { fontSize: 10, color: Colors.textMuted },
  chatStatus: { fontSize: 10, fontWeight: "700" as const },
  eventCard: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  eventTop: { flexDirection: "row" as const, gap: 14, marginBottom: 10 },
  eventDateBadge: { width: 50, height: 56, borderRadius: 12, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  eventDateDay: { fontSize: 20, fontWeight: "800" as const, color: Colors.primary, lineHeight: 22 },
  eventDateMonth: { fontSize: 10, fontWeight: "700" as const, color: Colors.primaryLight, letterSpacing: 0.5 },
  eventName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  eventLocation: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  eventMeta: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  eventDesc: { fontSize: 12, color: Colors.textSecondary, lineHeight: 17, marginBottom: 12 },
  eventBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.primary, borderRadius: 10, height: 38 },
  eventBtnText: { fontSize: 13, fontWeight: "700" as const, color: Colors.white },
  activityList: { paddingHorizontal: PADDING, gap: 0, marginBottom: 20 },
  activityItem: { flexDirection: "row" as const, gap: 10, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5 },
  activityAction: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  activityDate: { fontSize: 10, color: Colors.textMuted },
  activityDetail: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
};
