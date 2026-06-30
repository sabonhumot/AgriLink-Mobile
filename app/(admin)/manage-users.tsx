import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function ManageUsers() {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>👥</Text>
      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.sub}>Browse, search, and manage all platform users</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center", padding: 24 },
  icon: { fontSize: 48, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: "700", color: Colors.text, marginBottom: 6 },
  sub: { fontSize: 13, color: Colors.textMuted, textAlign: "center" },
});
