import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StatusBar, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockListings, type QualityGrade, type ScheduleTag } from "@/data/farmerData";

const qualityGrades: QualityGrade[] = ["A", "B", "C"];
const scheduleTags: { key: ScheduleTag; label: string; icon: string }[] = [
  { key: "market_day", label: "Market Day", icon: "calendar-outline" },
  { key: "cooperative_store", label: "Cooperative Store", icon: "storefront-outline" },
  { key: "special_event", label: "Special Event", icon: "flag-outline" },
];

export default function EditListingScreen() {
  const { id } = useLocalSearchParams();
  const { top } = useSafeAreaInsets();

  const listing = useMemo(() => mockListings.find((l) => l.id === id), [id]);

  const [description, setDescription] = useState(listing?.description || "");
  const [qualityGrade, setQualityGrade] = useState<QualityGrade | "">(listing?.qualityGrade || "");
  const [quantityStr, setQuantityStr] = useState(listing?.quantity || "");
  const [priceStr, setPriceStr] = useState(listing?.price.toString() || "");
  const [scheduleTag, setScheduleTag] = useState<ScheduleTag | "">(listing?.scheduleTag || "");
  const [editReason, setEditReason] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);

  if (!listing) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 16, color: Colors.textMuted }}>Listing not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 12 }}>
          <Text style={{ color: Colors.primary, fontWeight: "600" }}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasReservations = listing.reservedQuantity > 0;
  const canEditPrice = !hasReservations;
  const minQuantity = listing.reservedQuantity;
  const isSoldOut = listing.status === "sold_out";
  const canArchive = isSoldOut && !hasReservations;

  const statusColor: Record<string, { bg: string; text: string }> = {
    active: { bg: "#DCFCE7", text: "#15803D" },
    reserved: { bg: "#DBEAFE", text: "#1D4ED8" },
    sold_out: { bg: "#FEE2E2", text: "#DC2626" },
    vouched: { bg: "#FEF3C7", text: "#D97706" },
    archived: { bg: Colors.surfaceAlt, text: Colors.textMuted },
  };

  const sc = statusColor[listing.status] || { bg: Colors.surfaceAlt, text: Colors.textMuted };

  const statusLabel = (s: string) => {
    switch (s) {
      case "sold_out": return "Sold Out";
      case "active": return "Active";
      case "reserved": return "Reserved";
      case "vouched": return "Vouched";
      case "archived": return "Archived";
      default: return s;
    }
  };

  const handleSaveEdit = () => {
    if (!editReason.trim()) {
      Alert.alert("Reason Required", "Please provide a reason for this edit.");
      return;
    }
    if (hasReservations && listing.price.toString() !== priceStr) {
      Alert.alert("Price Locked", "Price cannot be changed because confirmed reservations exist.");
      return;
    }
    const parsedQty = parseInt(quantityStr.split(" ")[0], 10);
    if (!isNaN(parsedQty) && parsedQty < minQuantity) {
      Alert.alert("Invalid Quantity", `Quantity cannot be reduced below the reserved quantity (${minQuantity} ${listing.unit}).`);
      return;
    }
    Alert.alert("Listing Updated", "Changes saved successfully. Edit has been logged in the system audit trail.");
    setShowEditForm(false);
    setEditReason("");
  };

  const handleArchive = () => {
    if (!isSoldOut) {
      Alert.alert("Cannot Archive", "Listing must have status Sold Out to archive.");
      return;
    }
    if (hasReservations) {
      Alert.alert("Cannot Archive", "Cannot archive listing with active or reserved orders.");
      return;
    }
    Alert.alert("Archive Listing", "Are you sure you want to archive this listing? It will be hidden from buyers.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Archive",
        style: "destructive",
        onPress: () => {
          Alert.alert("Archived", "Listing archived successfully.");
          router.back();
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          {/* Header */}
          <View style={[s.header, { paddingTop: top + 12 }]}>
            <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </TouchableOpacity>
            <Text style={s.headerTitle} numberOfLines={1}>{listing.name}</Text>
            <View style={{ width: 40 }} />
          </View>

          {/* Image */}
          <Image source={{ uri: listing.image }} style={s.mainImg} />

          {/* Status & meta */}
          <View style={s.metaBar}>
            <View style={[s.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[s.statusBadgeText, { color: sc.text }]}>{statusLabel(listing.status)}</Text>
            </View>
            {listing.vouched && (
              <View style={s.vouchBadge}>
                <Ionicons name="checkmark-circle" size={12} color={Colors.white} />
                <Text style={s.vouchBadgeText}>Vouched</Text>
              </View>
            )}
            <Text style={s.metaDate}>Created {listing.createdAt}</Text>
          </View>

          {/* Details card */}
          <View style={s.detailsCard}>
            <DetailRow label="Type" value={listing.type} />
            <DetailRow label="Grade" value={listing.qualityGrade || "—"} />
            <DetailRow label="Quantity" value={`${listing.quantity} (${listing.totalSold} sold, ${listing.reservedQuantity} reserved)`} />
            <DetailRow label="Price" value={hasReservations ? `₱${listing.price}/${listing.unit} (locked)` : `₱${listing.price}/${listing.unit}`} />
            <DetailRow label="Schedule" value={
              listing.scheduleTag === "market_day" ? "Market Day" :
              listing.scheduleTag === "cooperative_store" ? "Cooperative Store" : "Special Event"
            } />
            <DetailRow label="Harvest" value={listing.harvestDate} />
            {listing.description ? (
              <View style={s.detailRow}>
                <Text style={s.detailLabel}>Description</Text>
                <Text style={s.detailValue}>{listing.description}</Text>
              </View>
            ) : null}
          </View>

          {/* Edit History */}
          {listing.editHistory && listing.editHistory.length > 0 && (
            <>
              <Text style={s.sectionTitle}>Edit History</Text>
              <View style={s.historyList}>
                {listing.editHistory.map((entry, i) => (
                  <View key={i} style={s.historyItem}>
                    <View style={s.historyDot} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.historyField}>{entry.field}: {entry.oldValue} → {entry.newValue}</Text>
                      <Text style={s.historyReason}>Reason: {entry.reason}</Text>
                      <Text style={s.historyDate}>{entry.date}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}

          {/* Edit form */}
          {showEditForm && (
            <View style={s.editSection}>
              <Text style={s.sectionTitle}>Edit Listing</Text>

              <Text style={s.label}>Description</Text>
              <TextInput style={[s.input, s.textArea]} value={description} onChangeText={setDescription} multiline numberOfLines={3} placeholderTextColor={Colors.placeholder} placeholder="Update description" />

              <Text style={s.label}>Quality Grade</Text>
              <View style={s.chipWrap}>
                {qualityGrades.map((g) => (
                  <TouchableOpacity key={g} activeOpacity={0.7} style={[s.chip, qualityGrade === g && s.chipActive]} onPress={() => setQualityGrade(qualityGrade === g ? "" : g)}>
                    <Text style={[s.chipText, qualityGrade === g && s.chipActiveText]}>Grade {g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.label}>Quantity ({listing.unit})</Text>
              <View style={s.qtyRow}>
                <View style={s.qtyDisplay}>
                  <Text style={s.qtyDisplayText}>{listing.quantity}</Text>
                </View>
                <TextInput style={[s.input, { flex: 1 }]} value={quantityStr} onChangeText={setQuantityStr} keyboardType="numeric" placeholderTextColor={Colors.placeholder} placeholder="New quantity" />
              </View>
              {minQuantity > 0 && <Text style={s.hint}>Min: {minQuantity} {listing.unit} (reserved)</Text>}

              <Text style={s.label}>Price (₱/{listing.unit})</Text>
              {canEditPrice ? (
                <TextInput style={s.input} value={priceStr} onChangeText={setPriceStr} keyboardType="numeric" placeholderTextColor={Colors.placeholder} placeholder="New price" />
              ) : (
                <View style={s.lockedPrice}>
                  <Ionicons name="lock-closed" size={16} color={Colors.textMuted} />
                  <Text style={s.lockedPriceText}>₱{listing.price}/{listing.unit} — Price locked (confirmed reservations exist)</Text>
                </View>
              )}

              <Text style={s.label}>Schedule Tag</Text>
              <View style={s.scheduleList}>
                {scheduleTags.map((st) => (
                  <TouchableOpacity key={st.key} activeOpacity={0.7} style={[s.scheduleCard, scheduleTag === st.key && s.scheduleCardActive]} onPress={() => setScheduleTag(scheduleTag === st.key ? "" : st.key)}>
                    <Ionicons name={st.icon as any} size={18} color={scheduleTag === st.key ? Colors.white : Colors.primary} />
                    <Text style={[s.scheduleCardLabel, scheduleTag === st.key && s.scheduleCardLabelActive]}>{st.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.label}>Reason for Edit *</Text>
              <TextInput style={[s.input, s.textArea]} value={editReason} onChangeText={setEditReason} multiline numberOfLines={2} placeholderTextColor={Colors.placeholder} placeholder="Describe why you are making this change" />

              <TouchableOpacity activeOpacity={0.8} style={s.saveBtn} onPress={handleSaveEdit}>
                <Ionicons name="save-outline" size={18} color={Colors.white} />
                <Text style={s.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action buttons */}
          <View style={s.actions}>
            {!showEditForm ? (
              <TouchableOpacity activeOpacity={0.8} style={s.editBtn} onPress={() => setShowEditForm(true)}>
                <Ionicons name="create-outline" size={18} color={Colors.white} />
                <Text style={s.editBtnText}>Edit Listing</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity activeOpacity={0.8} style={s.cancelBtn} onPress={() => setShowEditForm(false)}>
                <Text style={s.cancelBtnText}>Cancel Edit</Text>
              </TouchableOpacity>
            )}

            {listing.status !== "archived" && (
              <TouchableOpacity
                activeOpacity={0.8}
                style={[s.archiveBtn, !canArchive && s.btnDisabled]}
                onPress={handleArchive}
                disabled={!canArchive}
              >
                <Ionicons name="archive-outline" size={18} color={!canArchive ? Colors.disabled : Colors.error} />
                <Text style={[s.archiveBtnText, !canArchive && s.archiveBtnDisabled]}>
                  {canArchive ? "Archive Listing" : !isSoldOut ? "Not Sold Out" : "Has Reservations"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.detailRow}>
      <Text style={s.detailLabel}>{label}</Text>
      <Text style={s.detailValue}>{value}</Text>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  headerTitle: { fontSize: 18, fontWeight: "800" as const, color: Colors.text, flex: 1, textAlign: "center" as const },
  mainImg: { width: "100%" as const, height: 180, backgroundColor: Colors.surfaceAlt },
  metaBar: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, paddingHorizontal: 16, paddingVertical: 12, flexWrap: "wrap" as const },
  statusBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  statusBadgeText: { fontSize: 11, fontWeight: "700" as const },
  vouchBadge: { flexDirection: "row" as const, alignItems: "center" as const, gap: 3, backgroundColor: Colors.success, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  vouchBadgeText: { fontSize: 10, fontWeight: "700" as const, color: Colors.white },
  metaDate: { fontSize: 11, color: Colors.textMuted, marginLeft: "auto" as const },
  detailsCard: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, padding: 14, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1, marginBottom: 16 },
  detailRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  detailLabel: { fontSize: 13, color: Colors.textMuted },
  detailValue: { fontSize: 13, fontWeight: "600" as const, color: Colors.text, maxWidth: "60%" as const, textAlign: "right" as const },
  sectionTitle: { fontSize: 16, fontWeight: "700" as const, color: Colors.text, paddingHorizontal: 16, marginBottom: 10 },
  historyList: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, padding: 14, marginBottom: 16 },
  historyItem: { flexDirection: "row" as const, gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  historyDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginTop: 5 },
  historyField: { fontSize: 12, fontWeight: "600" as const, color: Colors.text },
  historyReason: { fontSize: 11, color: Colors.textSecondary, marginTop: 1 },
  historyDate: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },
  editSection: { paddingHorizontal: 16, marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: Colors.text },
  textArea: { height: 80, paddingTop: 14, textAlignVertical: "top" as const },
  chipWrap: { flexDirection: "row" as const, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary },
  chipActiveText: { color: Colors.white },
  qtyRow: { flexDirection: "row" as const, gap: 8, alignItems: "center" as const },
  qtyDisplay: { backgroundColor: Colors.surfaceAlt, borderRadius: 12, paddingHorizontal: 12, height: 48, justifyContent: "center" as const },
  qtyDisplayText: { fontSize: 13, color: Colors.textMuted },
  hint: { fontSize: 10, color: Colors.textMuted, marginTop: 4 },
  lockedPrice: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, backgroundColor: Colors.surfaceAlt, borderRadius: 12, paddingHorizontal: 16, height: 48 },
  lockedPriceText: { fontSize: 12, color: Colors.textMuted, flex: 1 },
  scheduleList: { gap: 6 },
  scheduleCard: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, padding: 12, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  scheduleCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  scheduleCardLabel: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  scheduleCardLabelActive: { color: Colors.white },
  saveBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.primary, borderRadius: 14, height: 50, marginTop: 16, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  saveBtnText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
  actions: { paddingHorizontal: 16, gap: 10, marginBottom: 24 },
  editBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, backgroundColor: Colors.primary, borderRadius: 14, height: 50 },
  editBtnText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
  cancelBtn: { alignItems: "center" as const, justifyContent: "center" as const, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.border },
  cancelBtnText: { fontSize: 15, fontWeight: "600" as const, color: Colors.textSecondary },
  archiveBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, height: 50, borderRadius: 14, borderWidth: 1.5, borderColor: Colors.error + "40" },
  archiveBtnText: { fontSize: 14, fontWeight: "600" as const, color: Colors.error },
  archiveBtnDisabled: { color: Colors.disabled },
  btnDisabled: { opacity: 0.5 },
};
