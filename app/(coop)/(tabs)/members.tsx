import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopMembers, type CoopMember } from "@/data/coopData";

const PADDING = 16;

export default function CoopMembers() {
  const { top } = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = useMemo(() => {
    let list = mockCoopMembers;
    if (filter === "active") list = list.filter((m) => m.status === "active");
    if (filter === "inactive") list = list.filter((m) => m.status === "inactive");
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q) || m.barangay.toLowerCase().includes(q));
    }
    return list;
  }, [search, filter]);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <Text style={s.title}>Member Farmers</Text>
          <Text style={s.sub}>{mockCoopMembers.length} total members</Text>
        </View>

        <View style={s.searchRow}>
          <Ionicons name="search-outline" size={16} color={Colors.textMuted} style={{ marginRight: 8 }} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name or barangay..."
            placeholderTextColor={Colors.placeholder}
            value={search}
            onChangeText={setSearch}
          />
          {search !== "" && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        <View style={s.filterRow}>
          {(["all", "active", "inactive"] as const).map((f) => (
            <TouchableOpacity
              key={f}
              activeOpacity={0.7}
              style={[s.filterChip, filter === f && s.filterChipActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={s.list}>
          {filtered.map((m) => (
            <TouchableOpacity key={m.id} activeOpacity={0.7} style={s.card} onPress={() => router.push(`/(coop)/members/${m.id}`)}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{m.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.memberName}>{m.name}</Text>
                <Text style={s.memberMeta}>{m.barangay} · {m.farmSize}</Text>
                <View style={{ flexDirection: "row", gap: 12, marginTop: 4 }}>
                  <Text style={s.memberStat}>{m.activeListings} listings</Text>
                  <Text style={s.memberStat}>{m.totalTransactions} transactions</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end", gap: 4 }}>
                <View style={[s.statusBadge, { backgroundColor: m.status === "active" ? Colors.successSurface : Colors.surfaceAlt }]}>
                  <Text style={[s.statusText, { color: m.status === "active" ? Colors.success : Colors.textMuted }]}>
                    {m.status === "active" ? "Active" : "Inactive"}
                  </Text>
                </View>
                <Text style={s.joinDate}>Joined {m.joinDate}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = {
  header: { paddingHorizontal: PADDING, paddingBottom: 14 },
  title: { fontSize: 22, fontWeight: "800" as const, color: Colors.text },
  sub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
  searchRow: { flexDirection: "row" as const, alignItems: "center" as const, marginHorizontal: PADDING, backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 14, height: 44, marginBottom: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, fontSize: 14, color: Colors.text },
  filterRow: { flexDirection: "row" as const, paddingHorizontal: PADDING, gap: 8, marginBottom: 14 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white },
  filterChipActive: { backgroundColor: Colors.primary },
  filterChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.white },
  list: { paddingHorizontal: PADDING, gap: 8 },
  card: { flexDirection: "row" as const, backgroundColor: Colors.white, borderRadius: 14, padding: 14, alignItems: "center" as const, gap: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  avatarText: { fontSize: 18, fontWeight: "700" as const, color: Colors.primary },
  memberName: { fontSize: 14, fontWeight: "700" as const, color: Colors.text },
  memberMeta: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  memberStat: { fontSize: 10, color: Colors.textSecondary },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontSize: 10, fontWeight: "700" as const },
  joinDate: { fontSize: 9, color: Colors.textMuted },
};
