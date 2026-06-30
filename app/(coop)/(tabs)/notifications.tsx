import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockCoopNotifications } from "@/data/coopData";

const PADDING = 16;

export default function CoopNotifications() {
  const { top } = useSafeAreaInsets();
  const [notifications] = useState(mockCoopNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const typeIcon = (t: string) => {
    switch (t) {
      case "alert": return { name: "alert-circle", color: Colors.accent };
      case "success": return { name: "checkmark-circle", color: Colors.success };
      default: return { name: "information-circle", color: Colors.primaryLight };
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <View>
            <Text style={s.title}>Notifications</Text>
            <Text style={s.sub}>{unreadCount} unread</Text>
          </View>
        </View>

        <View style={s.list}>
          {notifications.map((n) => {
            const icon = typeIcon(n.type);
            return (
              <TouchableOpacity key={n.id} activeOpacity={0.7} style={[s.card, !n.read && s.cardUnread]}>
                <View style={[s.iconWrap, { backgroundColor: n.type === "alert" ? "#FEF3C7" : n.type === "success" ? "#DCFCE7" : "#E0E7FF" }]}>
                  <Ionicons name={icon.name as any} size={20} color={icon.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={[s.notifTitle, !n.read && { fontWeight: "700" }]}>{n.title}</Text>
                    {!n.read && <View style={s.unreadDot} />}
                  </View>
                  <Text style={s.notifMsg} numberOfLines={2}>{n.message}</Text>
                  <Text style={s.notifDate}>{n.date}</Text>
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
  list: { paddingHorizontal: PADDING, gap: 8 },
  card: { flexDirection: "row" as const, backgroundColor: Colors.white, borderRadius: 14, padding: 14, gap: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  cardUnread: { borderLeftWidth: 3, borderLeftColor: Colors.primary },
  iconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center" as const, justifyContent: "center" as const },
  notifTitle: { fontSize: 14, color: Colors.text, flex: 1 },
  notifMsg: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 17 },
  notifDate: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
};
