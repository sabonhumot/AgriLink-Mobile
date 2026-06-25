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
import { mockFarmer } from "@/data/farmerData";

export default function FarmerProfileScreen() {
  const { top } = useSafeAreaInsets();

  const infoItems = [
    { icon: "mail-outline" as const, label: "Email", value: mockFarmer.email },
    { icon: "call-outline" as const, label: "Phone", value: mockFarmer.phone },
    { icon: "location-outline" as const, label: "Address", value: mockFarmer.address },
    { icon: "calendar-outline" as const, label: "Member Since", value: mockFarmer.memberSince },
    { icon: "earth-outline" as const, label: "Farm Size", value: mockFarmer.farmSize },
    { icon: "people-outline" as const, label: "Cooperative", value: mockFarmer.cooperative },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <View style={[styles.header, { paddingTop: top + 12 }]}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {mockFarmer.name.split(" ").map((n) => n[0]).join("")}
            </Text>
          </View>
          <Text style={styles.name}>{mockFarmer.name}</Text>
          <View style={styles.roleTag}>
            <Ionicons name="leaf-outline" size={12} color={Colors.primary} />
            <Text style={styles.roleText}>Farmer</Text>
          </View>
        </View>

        {/* Info Section */}
        <Text style={styles.sectionLabel}>Contact Information</Text>
        <View style={styles.infoList}>
          {infoItems.map((item, i) => (
            <View key={i} style={styles.infoRow}>
              <View style={styles.infoIconWrap}>
                <Ionicons name={item.icon} size={18} color={Colors.primary} />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Menu */}
        <Text style={styles.sectionLabel}>Settings</Text>
        <View style={styles.menuList}>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <Ionicons name="create-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.menuText}>Help Center</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.iconLight} />
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.menuItem}>
            <Ionicons name="information-circle-outline" size={20} color={Colors.textSecondary} />
            <Text style={styles.menuText}>About</Text>
            <Ionicons name="chevron-forward" size={16} color={Colors.iconLight} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity activeOpacity={0.8} style={styles.logoutBtn}>
          <Ionicons name="log-out-outline" size={18} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = {
  header: {
    backgroundColor: "#F8FAF9",
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  profileCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    alignItems: "center" as const,
    marginBottom: 28,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 14,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: Colors.white,
  },
  name: {
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
    marginBottom: 8,
  },
  roleTag: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "600" as const,
    color: Colors.text,
  },
  menuList: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500" as const,
    color: Colors.text,
  },
  logoutBtn: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: Colors.errorSurface,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.error,
  },
};
