import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFarmerMembers } from "@/data/coordinatorData";

export default function FarmerManagement() {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");

  const filtered = useMemo(() => {
    let list = mockFarmerMembers;
    if (filter !== "all") list = list.filter((m) => m.status === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.cooperative.toLowerCase().includes(q));
    }
    return list;
  }, [search, filter]);

  const statusColor = (s: string) => {
    switch (s) {
      case "active": return { bg: "#DCFCE7", text: "#15803D" };
      case "inactive": return { bg: Colors.surfaceAlt, text: Colors.textMuted };
      case "suspended": return { bg: "#FEE2E2", text: "#DC2626" };
      default: return { bg: Colors.surfaceAlt, text: Colors.textMuted };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Farmer Management</Text>
          <View style={{ width: 40 }} />
        </View>
        <Text style={s.sub}>{mockFarmerMembers.length} registered farmers</Text>

        <View style={s.searchRow}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} />
          <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Search by name or cooperative..." placeholderTextColor={Colors.placeholder} />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={s.filterRow}>
          {(["all", "active", "inactive", "suspended"] as const).map((f) => (
            <TouchableOpacity key={f} activeOpacity={0.7} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filtered.map((f) => {
          const sc = statusColor(f.status);
          return (
            <TouchableOpacity key={f.id} activeOpacity={0.7} style={s.card} onPress={() => router.push(`/(coordinator)/farmer-management/${f.id}`)}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{f.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.farmerName}>{f.name}</Text>
                <Text style={s.farmerCoop}>{f.cooperative}</Text>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 2 }}>
                  <Text style={s.stat}>{f.activeListings} listings</Text>
                  <Text style={s.stat}>{f.totalTransactions} transactions</Text>
                </View>
              </View>
              <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
                <Text style={[s.statusText, { color: sc.text }]}>{f.status.charAt(0).toUpperCase() + f.status.slice(1)}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  sub: { fontSize: 13, color: Colors.textMuted, paddingHorizontal: 16, marginBottom: 14 },
  searchRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, height: 44, marginBottom: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterRow: { flexDirection: "row" as const, paddingHorizontal: 16, gap: 8, marginBottom: 14, flexWrap: "wrap" as const },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.white },
  card: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  avatarText: { fontSize: 16, fontWeight: "700" as const, color: Colors.primary },
  farmerName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  farmerCoop: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  stat: { fontSize: 10, color: Colors.textSecondary },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: "700" as const },
};
