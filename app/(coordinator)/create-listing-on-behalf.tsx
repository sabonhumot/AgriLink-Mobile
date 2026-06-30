import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { mockFarmerMembers, type FarmerMember } from "@/data/coordinatorData";
import { cropTypes } from "@/data/crops";

const qualityGrades = ["A", "B", "C"];
const scheduleTags = [
  { key: "market_day", label: "Market Day", icon: "calendar-outline" },
  { key: "cooperative_store", label: "Cooperative Store", icon: "storefront-outline" },
  { key: "special_event", label: "Special Event", icon: "flag-outline" },
];

export default function CreateListingOnBehalf() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedFarmer, setSelectedFarmer] = useState<FarmerMember | null>(null);
  const [showFarmerPicker, setShowFarmerPicker] = useState(false);
  const [cropName, setCropName] = useState("");
  const [cropType, setCropType] = useState("");
  const [grade, setGrade] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [scheduleTag, setScheduleTag] = useState("");
  const [imageCount, setImageCount] = useState(0);

  const activeFarmers = mockFarmerMembers.filter((f) => f.status === "active");

  const handleSubmit = () => {
    if (!cropName.trim() || !cropType || !quantity || !price || !scheduleTag) {
      Alert.alert("Missing Fields", "Please fill in all required fields.");
      return;
    }
    Alert.alert(
      "Listing Created",
      `Listing for "${cropName}" has been created on behalf of ${selectedFarmer?.name}.\n\nCoordinator involvement has been logged in the system audit trail.`
    );
    router.back();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
          <View style={[s.header, { paddingTop: top + 12 }]}>
            <TouchableOpacity onPress={() => step === 2 ? setStep(1) : router.back()} style={s.backBtn}>
              <Ionicons name="arrow-back" size={22} color={Colors.text} />
            </TouchableOpacity>
            <Text style={s.title}>Create Listing</Text>
            <View style={{ width: 40 }} />
          </View>
          <Text style={s.subtitle}>on behalf of a farmer</Text>

          <View style={s.stepIndicator}>
            <View style={[s.stepDot, step >= 1 && s.stepDotActive]}><Text style={[s.stepDotText, step >= 1 && s.stepDotTextActive]}>1</Text></View>
            <View style={[s.stepLine, step >= 2 && s.stepLineActive]} />
            <View style={[s.stepDot, step >= 2 && s.stepDotActive]}><Text style={[s.stepDotText, step >= 2 && s.stepDotTextActive]}>2</Text></View>
          </View>

          {step === 1 && (
            <>
              <Text style={s.sectionLabel}>Select Farmer</Text>
              <TouchableOpacity activeOpacity={0.7} style={s.farmerPicker} onPress={() => setShowFarmerPicker(!showFarmerPicker)}>
                {selectedFarmer ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 10, flex: 1 }}>
                    <View style={s.farmerAvatar}><Text style={s.farmerAvatarText}>{selectedFarmer.name.charAt(0)}</Text></View>
                    <View style={{ flex: 1 }}>
                      <Text style={s.pickerName}>{selectedFarmer.name}</Text>
                      <Text style={s.pickerCoop}>{selectedFarmer.cooperative}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={{ color: Colors.placeholder, flex: 1 }}>Select a farmer member...</Text>
                )}
                <Ionicons name={showFarmerPicker ? "chevron-up" : "chevron-down"} size={18} color={Colors.textMuted} />
              </TouchableOpacity>

              {showFarmerPicker && (
                <View style={s.pickerDropdown}>
                  {activeFarmers.map((f) => (
                    <TouchableOpacity key={f.id} activeOpacity={0.7} style={s.pickerItem} onPress={() => { setSelectedFarmer(f); setShowFarmerPicker(false); }}>
                      <View style={s.farmerAvatar}><Text style={s.farmerAvatarText}>{f.name.charAt(0)}</Text></View>
                      <View style={{ flex: 1 }}>
                        <Text style={s.pickerName}>{f.name}</Text>
                        <Text style={s.pickerCoop}>{f.cooperative} · {f.farmSize}</Text>
                      </View>
                      {selectedFarmer?.id === f.id && <Ionicons name="checkmark-circle" size={18} color={Colors.primary} />}
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {selectedFarmer && (
                <View style={s.farmerInfo}>
                  <Text style={s.farmerInfoTitle}>Farmer Details</Text>
                  <Text style={s.farmerInfoText}>Email: {selectedFarmer.email}</Text>
                  <Text style={s.farmerInfoText}>Phone: {selectedFarmer.phone}</Text>
                  <Text style={s.farmerInfoText}>Address: {selectedFarmer.address}</Text>
                  <Text style={s.farmerInfoText}>Listings: {selectedFarmer.activeListings} · Transactions: {selectedFarmer.totalTransactions}</Text>
                </View>
              )}

              <TouchableOpacity
                activeOpacity={0.8}
                style={[s.nextBtn, !selectedFarmer && s.btnDisabled]}
                disabled={!selectedFarmer}
                onPress={() => setStep(2)}
              >
                <Text style={s.nextBtnText}>Next: Listing Details</Text>
                <Ionicons name="arrow-forward" size={18} color={Colors.white} />
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <View style={s.selectedBanner}>
                <Ionicons name="person-outline" size={14} color={Colors.white} />
                <Text style={s.selectedBannerText}>Creating listing for {selectedFarmer?.name}</Text>
              </View>

              <Text style={s.fieldLabel}>Crop Name</Text>
              <TextInput style={s.input} value={cropName} onChangeText={setCropName} placeholder="e.g. Fresh White Rice" placeholderTextColor={Colors.placeholder} />

              <Text style={s.fieldLabel}>Crop Type</Text>
              <View style={s.chipWrap}>
                {cropTypes.map((t) => (
                  <TouchableOpacity key={t} activeOpacity={0.7} style={[s.chip, cropType === t && s.chipActive]} onPress={() => setCropType(cropType === t ? "" : t)}>
                    <Text style={[s.chipText, cropType === t && s.chipActiveText]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Quality Grade</Text>
              <View style={s.chipWrap}>
                {qualityGrades.map((g) => (
                  <TouchableOpacity key={g} activeOpacity={0.7} style={[s.chip, grade === g && s.chipActive]} onPress={() => setGrade(grade === g ? "" : g)}>
                    <Text style={[s.chipText, grade === g && s.chipActiveText]}>Grade {g}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Quantity</Text>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <TextInput style={[s.input, { flex: 1 }]} value={quantity} onChangeText={setQuantity} keyboardType="numeric" placeholder="e.g. 500" placeholderTextColor={Colors.placeholder} />
                <View style={s.unitPicker}>
                  {["kg", "sack", "piece"].map((u) => (
                    <TouchableOpacity key={u} activeOpacity={0.7} style={[s.unitChip, unit === u && s.unitChipActive]} onPress={() => setUnit(u)}>
                      <Text style={[s.unitChipText, unit === u && s.unitChipTextActive]}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Text style={s.fieldLabel}>Price (₱ per {unit})</Text>
              <TextInput style={s.input} value={price} onChangeText={setPrice} keyboardType="numeric" placeholder="e.g. 45" placeholderTextColor={Colors.placeholder} />

              <Text style={s.fieldLabel}>Schedule Tag</Text>
              <View style={s.scheduleList}>
                {scheduleTags.map((st) => (
                  <TouchableOpacity key={st.key} activeOpacity={0.7} style={[s.scheduleCard, scheduleTag === st.key && s.scheduleCardActive]} onPress={() => setScheduleTag(scheduleTag === st.key ? "" : st.key)}>
                    <Ionicons name={st.icon as any} size={18} color={scheduleTag === st.key ? Colors.white : Colors.primary} />
                    <Text style={[s.scheduleCardLabel, scheduleTag === st.key && s.scheduleCardLabelActive]}>{st.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={s.fieldLabel}>Images</Text>
              <View style={s.imageArea}>
                {imageCount === 0 ? (
                  <>
                    <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
                    <Text style={s.imageAreaText}>Tap to add photos</Text>
                    <TouchableOpacity activeOpacity={0.7} style={s.addImageBtn} onPress={() => setImageCount(1)}>
                      <Text style={s.addImageBtnText}>Add Photo</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View style={{ width: "100%" }}>
                    <View style={s.imagePreviewRow}>
                      {Array.from({ length: imageCount }).map((_, i) => (
                        <View key={i} style={s.imageThumb}>
                          <Ionicons name="image-outline" size={20} color={Colors.primary} />
                        </View>
                      ))}
                      <TouchableOpacity style={s.addMoreBtn} onPress={() => setImageCount((c) => Math.min(c + 1, 5))}>
                        <Ionicons name="add" size={20} color={Colors.textMuted} />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity activeOpacity={0.8} style={s.submitBtn} onPress={handleSubmit}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.white} />
                <Text style={s.submitBtnText}>Create Listing</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = {
  header: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "space-between" as const, paddingHorizontal: 16, paddingBottom: 4 },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  title: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  subtitle: { fontSize: 12, color: Colors.textMuted, paddingHorizontal: 16, marginBottom: 12 },
  stepIndicator: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 0, marginBottom: 20 },
  stepDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: Colors.surfaceAlt, alignItems: "center" as const, justifyContent: "center" as const },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotText: { fontSize: 12, fontWeight: "700" as const, color: Colors.textMuted },
  stepDotTextActive: { color: Colors.white },
  stepLine: { width: 40, height: 2, backgroundColor: Colors.divider },
  stepLineActive: { backgroundColor: Colors.primary },
  sectionLabel: { fontSize: 14, fontWeight: "600" as const, color: Colors.textSecondary, paddingHorizontal: 16, marginBottom: 8 },
  farmerPicker: { flexDirection: "row" as const, alignItems: "center" as const, marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, padding: 14, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  farmerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  farmerAvatarText: { fontSize: 14, fontWeight: "700" as const, color: Colors.primary },
  pickerName: { fontSize: 14, fontWeight: "600" as const, color: Colors.text },
  pickerCoop: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
  pickerDropdown: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 14, marginTop: 4, shadowColor: Colors.black, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  pickerItem: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, padding: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  farmerInfo: { marginHorizontal: 16, backgroundColor: Colors.surfaceAlt, borderRadius: 12, padding: 14, marginTop: 12 },
  farmerInfoTitle: { fontSize: 12, fontWeight: "700" as const, color: Colors.text, marginBottom: 6 },
  farmerInfoText: { fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  nextBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 14, height: 50, marginTop: 20 },
  nextBtnText: { fontSize: 15, fontWeight: "700" as const, color: Colors.white },
  btnDisabled: { opacity: 0.5 },
  selectedBanner: { flexDirection: "row" as const, alignItems: "center" as const, gap: 8, marginHorizontal: 16, backgroundColor: Colors.primaryLight, borderRadius: 10, padding: 10, marginBottom: 16 },
  selectedBannerText: { fontSize: 12, fontWeight: "600" as const, color: Colors.white },
  fieldLabel: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary, paddingHorizontal: 16, marginBottom: 8, marginTop: 14 },
  input: { marginHorizontal: 16, backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: Colors.text },
  chipWrap: { flexDirection: "row" as const, flexWrap: "wrap" as const, paddingHorizontal: 16, gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.border },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  chipActiveText: { color: Colors.white },
  unitPicker: { flexDirection: "row" as const, gap: 4, alignItems: "center" as const },
  unitChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.surfaceAlt },
  unitChipActive: { backgroundColor: Colors.primary },
  unitChipText: { fontSize: 12, fontWeight: "600" as const, color: Colors.textSecondary },
  unitChipTextActive: { color: Colors.white },
  scheduleList: { paddingHorizontal: 16, gap: 6 },
  scheduleCard: { flexDirection: "row" as const, alignItems: "center" as const, gap: 10, padding: 12, borderRadius: 10, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  scheduleCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  scheduleCardLabel: { fontSize: 13, fontWeight: "600" as const, color: Colors.text },
  scheduleCardLabelActive: { color: Colors.white },
  imageArea: { marginHorizontal: 16, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, borderStyle: "dashed" as const, padding: 24, alignItems: "center" as const, gap: 8 },
  imageAreaText: { fontSize: 13, color: Colors.textMuted },
  addImageBtn: { backgroundColor: Colors.primarySurface, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  addImageBtnText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  imagePreviewRow: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  imageThumb: { width: 60, height: 60, borderRadius: 10, backgroundColor: Colors.primarySurface, alignItems: "center" as const, justifyContent: "center" as const },
  addMoreBtn: { width: 60, height: 60, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.border, borderStyle: "dashed" as const, alignItems: "center" as const, justifyContent: "center" as const },
  submitBtn: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 6, marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 14, height: 50, marginTop: 20, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  submitBtnText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
};
