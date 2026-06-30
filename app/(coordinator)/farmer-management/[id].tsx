import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFarmerMembers, type FarmerMember } from "@/data/coordinatorData";

export default function FarmerDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top } = useSafeAreaInsets();
  const [farmer, setFarmer] = useState<FarmerMember | undefined>(
    mockFarmerMembers.find((f) => f.id === id)
  );
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(farmer?.name || "");
  const [email, setEmail] = useState(farmer?.email || "");
  const [phone, setPhone] = useState(farmer?.phone || "");
  const [membershipStatus, setMembershipStatus] = useState(farmer?.status || "active");
  const [editReason, setEditReason] = useState("");

  if (!farmer) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Farmer not found</Text>
      </View>
    );
  }

  const handleSave = () => {
    if (!editReason.trim()) {
      Alert.alert("Reason Required", "Please provide a reason for this change.");
      return;
    }
    Alert.alert("Profile Updated", "Farmer information has been updated and logged in the audit trail.");
    setEditing(false);
    setEditReason("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Farmer Details</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)} style={s.editToggle}>
            <Ionicons name={editing ? "close-outline" : "create-outline"} size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={s.profileCard}>
          <View style={s.avatar}><Text style={s.avatarText}>{farmer.name.charAt(0)}</Text></View>
          {editing ? (
            <TextInput style={s.editNameInput} value={name} onChangeText={setName} />
          ) : (
            <Text style={s.farmerName}>{farmer.name}</Text>
          )}
          <View style={[s.badge, { backgroundColor: farmer.status === "active" ? Colors.successSurface : farmer.status === "suspended" ? Colors.errorSurface : Colors.surfaceAlt }]}>
            <Text style={[s.badgeText, { color: farmer.status === "active" ? Colors.success : farmer.status === "suspended" ? Colors.error : Colors.textMuted }]}>
              {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNum}>{farmer.activeListings}</Text>
            <Text style={s.statLabel}>Active Listings</Text>
          </View>
          <View style={[s.statItem, { borderLeftWidth: 1, borderRightWidth: 1, borderColor: Colors.divider }]}>
            <Text style={s.statNum}>{farmer.totalTransactions}</Text>
            <Text style={s.statLabel}>Transactions</Text>
          </View>
          <View style={s.statItem}>
            <Text style={s.statNum}>{farmer.farmSize}</Text>
            <Text style={s.statLabel}>Farm Size</Text>
          </View>
        </View>

        <View style={s.infoCard}>
          <InfoRow icon="mail-outline" label="Email" value={farmer.email} />
          <InfoRow icon="call-outline" label="Phone" value={farmer.phone} />
          <InfoRow icon="location-outline" label="Address" value={farmer.address} />
          <InfoRow icon="people-outline" label="Cooperative" value={farmer.cooperative} />
          <InfoRow icon="calendar-outline" label="Member Since" value={farmer.memberSince} />
        </View>

        {editing && (
          <View style={s.editSection}>
            <Text style={s.sectionTitle}>Edit Profile</Text>

            <Text style={s.label}>Email</Text>
            <TextInput style={s.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

            <Text style={s.label}>Phone</Text>
            <TextInput style={s.input} value={phone} onChangeText={setPhone} />

            <Text style={s.label}>Membership Status</Text>
            <View style={s.statusRow}>
              {(["active", "inactive", "suspended"] as const).map((s) => (
                <TouchableOpacity key={s} activeOpacity={0.7} style={[s.statusChip, membershipStatus === s && s.statusChipActive]} onPress={() => setMembershipStatus(s)}>
                  <Text style={[s.statusChipText, membershipStatus === s && s.statusChipTextActive]}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={s.label}>Reason for Edit *</Text>
            <TextInput style={[s.input, s.textArea]} value={editReason} onChangeText={setEditReason} multiline placeholder="Why are you making this change?" placeholderTextColor={Colors.placeholder} />

            <TouchableOpacity activeOpacity={0.8} style={s.saveBtn} onPress={handleSave}>
              <Ionicons name="save-outline" size={18} color={Colors.white} />
              <Text style={s.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={s.infoRow}>
      <Ionicons name={icon as any} size={16} color={Colors.textMuted} />
      <View style={{ flex: 1 }}>
        <Text style={s.infoLabel}>{label}</Text>
        <Text style={s.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  editToggle: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  profileCard: { alignItems: "center" as const, paddingVertical: 20, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 20, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 3 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const, marginBottom: 10 },
  avatarText: { fontSize: 24, fontWeight: "700" as const, color: Colors.primary },
  farmerName: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  editNameInput: { fontSize: 18, fontWeight: "800" as const, color: Colors.text, borderBottomWidth: 1, borderBottomColor: Colors.primary, textAlign: "center" as const, paddingVertical: 2, minWidth: 120 },
  badge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 3, marginTop: 8 },
  badgeText: { fontSize: 11, fontWeight: "700" as const },
  statsRow: { flexDirection: "row" as const, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  statItem: { flex: 1, alignItems: "center" as const, paddingVertical: 12 },
  statNum: { fontSize: 16, fontWeight: "800" as const, color: Colors.text },
  statLabel: { fontSize: 10, color: Colors.textMuted, marginTop: 2 },
  infoCard: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  infoRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  infoLabel: { fontSize: 11, color: Colors.textMuted },
  infoValue: { fontSize: 13, color: Colors.text, marginTop: 1 },
  editSection: { paddingHorizontal: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, marginBottom: 12 },
  label: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: Colors.text },
  textArea: { height: 80, paddingTop: 14, textAlignVertical: "top" as const },
  statusRow: { flexDirection: "row" as const, gap: 8 },
  statusChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  statusChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  statusChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  statusChipTextActive: { color: Colors.white },
  saveBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.primary, borderRadius: 14, height: 50, marginTop: 16, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
};
