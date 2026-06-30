import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockNotifications } from "@/data/buyerData";

export default function NotificationsScreen() {
  const { top } = useSafeAreaInsets();
  const [notifications, setNotifications] = useState(mockNotifications);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotifStyle = (title: string) => {
    if (title.includes("Accepted"))
      return { icon: "checkmark-circle" as const, color: "#22C55E" };
    if (title.includes("Delivered"))
      return { icon: "car" as const, color: Colors.primary };
    if (title.includes("Rejected"))
      return { icon: "close-circle" as const, color: Colors.error };
    if (title.includes("Crops"))
      return { icon: "leaf" as const, color: "#F59E0B" };
    return { icon: "notifications" as const, color: Colors.primary };
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <Text style={styles.unreadLabel}>{unreadCount} unread</Text>
          )}
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity activeOpacity={0.7} onPress={markAllRead}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {notifications.length > 0 ? (
          notifications.map((notif) => {
            const style = getNotifStyle(notif.title);
            return (
              <TouchableOpacity
                key={notif.id}
                activeOpacity={0.8}
                style={[
                  styles.notifCard,
                  !notif.read && styles.notifCardUnread,
                ]}
                onPress={() => markAsRead(notif.id)}
              >
                <View
                  style={[
                    styles.notifIconWrap,
                    { backgroundColor: style.color + "12" },
                  ]}
                >
                  <Ionicons name={style.icon} size={20} color={style.color} />
                </View>

                <View style={styles.notifContent}>
                  <View style={styles.notifTopRow}>
                    <Text
                      style={[
                        styles.notifTitle,
                        !notif.read && styles.notifTitleUnread,
                      ]}
                    >
                      {notif.title}
                    </Text>
                    {!notif.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifMessage}>{notif.message}</Text>
                  <Text style={styles.notifDate}>
                    {new Date(notif.date).toLocaleDateString("en-PH", {
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="notifications-off-outline" size={28} color={Colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>All caught up</Text>
            <Text style={styles.emptyDesc}>No new notifications</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = {
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  unreadLabel: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "500" as const,
    marginTop: 2,
  },
  markAllText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: Colors.primarySurface,
    borderRadius: 8,
    overflow: "hidden" as const,
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
    gap: 10,
  },
  notifCard: {
    flexDirection: "row" as const,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  notifCardUnread: {
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
    backgroundColor: Colors.primarySurface + "60",
  },
  notifIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  notifContent: {
    flex: 1,
  },
  notifTopRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 8,
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  notifTitleUnread: {
    fontWeight: "700" as const,
    color: Colors.primary,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Colors.primary,
  },
  notifMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 4,
  },
  notifDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: "center" as const,
    paddingTop: 80,
  },
  emptyIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textMuted,
  },
};
