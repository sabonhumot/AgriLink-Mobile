import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StatusBar, Alert, TextInput, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockPendingFarmers, type PendingFarmer } from "@/data/coordinatorData";

export default function PendingApprovals() {
  const { top } = useSafeAreaInsets();
  const [farmers, setFarmers] = useState(mockPendingFarmers.filter((f) => f.status === "pending"));
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleApprove = (id: string) => {
    Alert.alert("Approve Farmer", "This farmer will be granted full access to the platform.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          setFarmers((prev) => prev.filter((f) => f.id !== id));
          Alert.alert("Approved", "Farmer has been approved successfully.");
        },
      },
    ]);
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Alert.alert("Reason Required", "Please provide a reason for rejection.");
      return;
    }
    setFarmers((prev) => prev.filter((f) => f.id !== rejectModal));
    setRejectModal(null);
    setRejectReason("");
    Alert.alert("Rejected", "Farmer registration has been rejected.");
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.title}>Pending Approvals</Text>
          <View style={{ width: 40 }} />
        </View>

        <Text style={s.sub}>{farmers.length} farmer{farmers.length !== 1 ? "s" : ""} awaiting review</Text>

        {farmers.map((f) => (
          <View key={f.id} style={s.card}>
            <View style={s.cardHeader}>
              <View style={s.avatar}>
                <Text style={s.avatarText}>{f.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.farmerName}>{f.name}</Text>
                <Text style={s.farmerCoop}>{f.cooperative}</Text>
              </View>
              <View style={s.pendingBadge}>
                <Text style={s.pendingBadgeText}>Pending</Text>
              </View>
            </View>

            <View style={s.details}>
              <DetailRow icon="mail-outline" value={f.email} />
              <DetailRow icon="call-outline" value={f.phone} />
              <DetailRow icon="card-outline" value={`ID: ${f.cooperativeId}`} />
              <DetailRow icon="resize-outline" value={`Farm: ${f.farmSize}`} />
              <DetailRow icon="location-outline" value={f.address} />
              <DetailRow icon="calendar-outline" value={`Submitted: ${f.submittedDate}`} />
            </View>

            <View style={s.docSection}>
              <Text style={s.docTitle}>Documents</Text>
              {f.documents.map((doc, i) => (
                <View key={i} style={s.docRow}>
                  <Ionicons
                    name={doc.uploaded ? "checkmark-circle" : "close-circle"}
                    size={14}
                    color={doc.uploaded ? Colors.success : Colors.error}
                  />
                  <Text style={s.docName}>{doc.name}</Text>
                </View>
              ))}
            </View>

            <View style={s.actions}>
              <TouchableOpacity activeOpacity={0.8} style={s.approveBtn} onPress={() => handleApprove(f.id)}>
                <Ionicons name="checkmark" size={18} color={Colors.white} />
                <Text style={s.approveBtnText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={s.rejectBtn} onPress={() => setRejectModal(f.id)}>
                <Ionicons name="close" size={18} color={Colors.error} />
                <Text style={s.rejectBtnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={rejectModal !== null} transparent animationType="fade">
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <Text style={s.modalTitle}>Reject Farmer</Text>
            <Text style={s.modalDesc}>Provide a reason for rejecting this registration.</Text>
            <TextInput
              style={s.modalInput}
              placeholder="Enter rejection reason..."
              placeholderTextColor={Colors.placeholder}
              value={rejectReason}
              onChangeText={setRejectReason}
              multiline
              numberOfLines={3}
            />
            <View style={s.modalActions}>
              <TouchableOpacity activeOpacity={0.7} style={s.modalCancel} onPress={() => { setRejectModal(null); setRejectReason(""); }}>
                <Text style={s.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} style={s.modalConfirm} onPress={handleReject}>
                <Text style={s.modalConfirmText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function DetailRow({ icon, value }: { icon: string; value: string }) {
  return (
    <View style={s.detailRow}>
      <Ionicons name={icon as any} size={14} color={Colors.textMuted} />
      <Text style={s.detailText}>{value}</Text>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  sub: { fontSize: 13, color: Colors.textMuted, paddingHorizontal: 16, marginBottom: 16 },
  card: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: Colors.black, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  cardHeader: { flexDirection: "row" as const, alignItems: "center" as const, gap: 12, marginBottom: 14 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  avatarText: { fontSize: 18, fontWeight: "700" as const, color: Colors.primary },
  farmerName: { fontSize: 16, fontWeight: "700" as const, color: Colors.text },
  farmerCoop: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  pendingBadge: { backgroundColor: "#FEF3C7", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pendingBadgeText: { fontSize: 10, fontWeight: "700" as const, color: "#D97706" },
  details: { marginBottom: 12 },
  detailRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, paddingVertical: 4 },
  detailText: { fontSize: 12, color: Colors.textSecondary, flex: 1 },
  docSection: { backgroundColor: Colors.surfaceAlt, borderRadius: 10, padding: 12, marginBottom: 14 },
  docTitle: { fontSize: 12, fontWeight: "700" as const, color: Colors.text, marginBottom: 8 },
  docRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 6, paddingVertical: 3 },
  docName: { fontSize: 11, color: Colors.textSecondary },
  actions: { flexDirection: "row" as const, gap: 10 },
  approveBtn: { flex: 1, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.success, borderRadius: 12, height: 44 },
  approveBtnText: { fontSize: 14, fontWeight: "700" as const, color: Colors.white },
  rejectBtn: { flex: 1, flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.errorSurface, borderRadius: 12, height: 44 },
  rejectBtnText: { fontSize: 14, fontWeight: "700" as const, color: Colors.error },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center" as const, padding: 32 },
  modalContent: { backgroundColor: Colors.white, borderRadius: 20, padding: 24 },
  modalTitle: { fontSize: 18, fontWeight: "800" as const, color: Colors.text, marginBottom: 6 },
  modalDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 16 },
  modalInput: { backgroundColor: Colors.surfaceAlt, borderRadius: 12, padding: 14, fontSize: 14, color: Colors.text, height: 80, textAlignVertical: "top" as const, marginBottom: 16 },
  modalActions: { flexDirection: "row" as const, gap: 10 },
  modalCancel: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const, height: 46, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border },
  modalCancelText: { fontSize: 14, fontWeight: "600" as const, color: Colors.textSecondary },
  modalConfirm: { flex: 1, alignItems: "center" as const, justifyContent: "center" as const, height: 46, borderRadius: 12, backgroundColor: Colors.error },
  modalConfirmText: { fontSize: 14, fontWeight: "700" as const, color: Colors.white },
};
