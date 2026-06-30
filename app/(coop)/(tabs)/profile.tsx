import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopProfile, mockCoopMembers } from "@/data/coopData";

const PADDING = 16;

export default function CoopProfile() {
  const { top } = useSafeAreaInsets();

  const activeMembers = mockCoopMembers.filter((m) => m.status === "active").length;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <Text style={s.title}>Cooperative Profile</Text>
        </View>

        <View style={s.profileCard}>
          <View style={s.avatarLarge}>
            <Ionicons name="people" size={32} color={Colors.primary} />
          </View>
          <Text style={s.coopName}>{mockCoopProfile.name}</Text>
          <Text style={s.coopType}>Agricultural Cooperative</Text>
          <View style={s.memberBadge}>
            <Ionicons name="people-outline" size={14} color={Colors.primary} />
            <Text style={s.memberBadgeText}>{activeMembers} Active Members</Text>
          </View>
        </View>

        <View style={s.sectionCard}>
          <View style={s.infoRow}>
            <Ionicons name="location-outline" size={18} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Address</Text>
              <Text style={s.infoValue}>{mockCoopProfile.address}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="call-outline" size={18} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Phone</Text>
              <Text style={s.infoValue}>{mockCoopProfile.phone}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="mail-outline" size={18} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{mockCoopProfile.email}</Text>
            </View>
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="calendar-outline" size={18} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Founded</Text>
              <Text style={s.infoValue}>{mockCoopProfile.foundingDate}</Text>
            </View>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNumber}>{mockCoopMembers.length}</Text>
            <Text style={s.statLabel}>Total Members</Text>
          </View>
          <View style={[s.statItem, { borderLeftWidth: 1, borderLeftColor: Colors.divider }]}>
            <Text style={s.statNumber}>{mockCoopProfile.totalFarmArea}</Text>
            <Text style={s.statLabel}>Total Farm Area</Text>
          </View>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={s.logoutBtn} onPress={() => router.replace("/")}>
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = {
  header: { paddingHorizontal: PADDING, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  profileCard: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 20, padding: 24, alignItems: "center" as const, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  avatarLarge: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 12 },
  coopName: { fontSize: 18, fontWeight: "800" as const, color: Colors.text, textAlign: "center" as const },
  coopType: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  memberBadge: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6, backgroundColor: Colors.primarySurface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginTop: 10 },
  memberBadgeText: { fontSize: 11, fontWeight: "600" as const, color: Colors.primary },
  sectionCard: { marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: "row" as const, gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: 11, color: Colors.textMuted },
  infoValue: { fontSize: 14, color: Colors.text, fontWeight: "500" as const, marginTop: 1 },
  statsRow: { flexDirection: "row" as const, marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 24, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  statItem: { flex: 1, alignItems: "center" as const, paddingVertical: 16 },
  statNumber: { fontSize: 20, fontWeight: "800" as const, color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  logoutBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 8, marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 14, height: 50, marginBottom: 24, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  logoutText: { fontSize: 15, fontWeight: "600" as const, color: Colors.error },
};
