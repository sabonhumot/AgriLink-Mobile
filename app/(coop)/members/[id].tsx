import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopMembers, type CoopMember } from "@/data/coopData";

export default function MemberDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const [member, setMember] = useState<CoopMember | undefined>(
    mockCoopMembers.find((m) => m.id === id)
  );

  if (!member) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.backRow, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="chevron-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Member Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={s.profileCard}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{member.name.charAt(0)}</Text>
          </View>
          <Text style={s.memberName}>{member.name}</Text>
          <View style={[s.badge, { backgroundColor: member.status === "active" ? Colors.successSurface : Colors.surfaceAlt }]}>
            <Text style={[s.badgeText, { color: member.status === "active" ? Colors.success : Colors.textMuted }]}>
              {member.status === "active" ? "Active" : "Inactive"}
            </Text>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNum}>{member.activeListings}</Text>
            <Text style={s.statLabel}>Active Listings</Text>
          </View>
          <View style={[s.statItem, { borderLeftWidth: 1, borderLeftColor: Colors.divider, borderRightWidth: 1, borderRightColor: Colors.divider }]}>
            <Text style={s.statNum}>{member.totalTransactions}</Text>
            <Text style={s.statLabel}>Transactions</Text>
          </View>
          <View style={s.statItem}>
            <Text style={s.statNum}>{member.farmSize}</Text>
            <Text style={s.statLabel}>Farm Size</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <View style={s.infoRow}>
            <Ionicons name="mail-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Email</Text>
              <Text style={s.infoValue}>{member.email}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="call-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Phone</Text>
              <Text style={s.infoValue}>{member.phone}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="location-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Address</Text>
              <Text style={s.infoValue}>{member.address}</Text>
            </View>
          </View>
          <View style={s.infoRow}>
            <Ionicons name="home-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Barangay</Text>
              <Text style={s.infoValue}>{member.barangay}</Text>
            </View>
          </View>
          <View style={[s.infoRow, { borderBottomWidth: 0 }]}>
            <Ionicons name="calendar-outline" size={16} color={Colors.textMuted} />
            <View style={{ flex: 1 }}>
              <Text style={s.infoLabel}>Member Since</Text>
              <Text style={s.infoValue}>{member.joinDate}</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={s.actionBtn}
          onPress={() => Alert.alert("Contact Member", `Calling ${member.name}...`)}
        >
          <Ionicons name="call-outline" size={18} color={Colors.white} />
          <Text style={s.actionBtnText}>Contact Member</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = {
  backRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 14 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "700" as const, color: Colors.text },
  profileCard: { alignItems: "center" as const, paddingVertical: 20, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 20, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 10 },
  avatarText: { fontSize: 26, fontWeight: "700" as const, color: Colors.primary },
  memberName: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8 },
  badgeText: { fontSize: 11, fontWeight: "700" as const },
  statsRow: { flexDirection: "row" as const, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  statItem: { flex: 1, alignItems: "center" as const, paddingVertical: 14 },
  statNum: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  infoCard: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 24, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, padding: 14, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: 11, color: Colors.textMuted },
  infoValue: { fontSize: 14, color: Colors.text, marginTop: 1 },
  actionBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 8, marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 14, height: 50 },
  actionBtnText: { fontSize: 15, fontWeight: "700" as const, color: Colors.white },
};
