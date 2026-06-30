import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cropTypes, CropType } from "@/data/crops";
import { mockListings } from "@/data/farmerData";
import type { QualityGrade, ScheduleTag } from "@/data/farmerData";

const qualityGrades: QualityGrade[] = ["A", "B", "C"];
const scheduleTags: { key: ScheduleTag; label: string; icon: string }[] = [
  { key: "market_day", label: "Market Day", icon: "calendar-outline" },
  { key: "cooperative_store", label: "Cooperative Store", icon: "storefront-outline" },
  { key: "special_event", label: "Special Event", icon: "flag-outline" },
];

export default function CreateListingScreen() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CropType | "">("");
  const [qualityGrade, setQualityGrade] = useState<QualityGrade | "">("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("kg");
  const [price, setPrice] = useState("");
  const [harvestDate, setHarvestDate] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [scheduleTag, setScheduleTag] = useState<ScheduleTag | "">("");

  const units = ["kg", "g", "bundle", "piece", "sack", "crate", "box"];

  const hasDuplicateType = type !== "" && mockListings.some(
    (l) => l.type === type && (l.status === "active" || l.status === "reserved" || l.status === "vouched"),
  );

  const isStep1Valid = name.trim() && type !== "" && qualityGrade !== "" && quantity.trim() && price.trim() && images.length > 0;
  const isStep2Valid = scheduleTag !== "";

  const handleSubmit = () => {
    if (!isStep1Valid) {
      Alert.alert("Incomplete", "Please fill in all required fields.");
      return;
    }
    if (hasDuplicateType) {
      Alert.alert("Duplicate Type", `You already have an active listing for "${type}". Only 1 active listing per crop type is allowed.`);
      return;
    }
    if (!isStep2Valid) {
      Alert.alert("Incomplete", "Please assign a schedule tag.");
      return;
    }
    Alert.alert("Listing Created", `${name} has been listed successfully.`, [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        {/* Header */}
        <View style={[s.header, { paddingTop: top + 12 }]}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.text} />
          </TouchableOpacity>
          <Text style={s.headerTitle}>Create Listing</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Step indicator */}
        <View style={s.stepRow}>
          <View style={[s.stepDot, step >= 1 && s.stepDotActive]}>
            <Text style={[s.stepDotText, step >= 1 && s.stepDotTextActive]}>1</Text>
          </View>
          <View style={[s.stepLine, step >= 2 && s.stepLineActive]} />
          <View style={[s.stepDot, step >= 2 && s.stepDotActive]}>
            <Text style={[s.stepDotText, step >= 2 && s.stepDotTextActive]}>2</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {step === 1 && (
            <>
              {/* Crop Name */}
              <Text style={s.label}>Crop Name *</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. Fresh White Rice"
                placeholderTextColor={Colors.placeholder}
                value={name}
                onChangeText={setName}
              />

              {/* Description */}
              <Text style={s.label}>Description</Text>
              <TextInput
                style={[s.input, s.textArea]}
                placeholder="Describe your crop quality, growing method, etc."
                placeholderTextColor={Colors.placeholder}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
              />

              {/* Crop Type */}
              <Text style={s.label}>Crop Type *</Text>
              <View style={s.chipWrap}>
                {cropTypes.map((t) => {
                  const disabled = mockListings.some(
                    (l) => l.type === t && (l.status === "active" || l.status === "reserved" || l.status === "vouched"),
                  );
                  return (
                    <TouchableOpacity
                      key={t}
                      activeOpacity={0.7}
                      style={[
                        s.chip,
                        type === t && s.chipActive,
                        disabled && type !== t && s.chipDisabled,
                      ]}
                      onPress={() => setType(type === t ? "" : t)}
                      disabled={disabled && type !== t}
                    >
                      <Text style={[
                        s.chipText,
                        type === t && s.chipActiveText,
                        disabled && type !== t && s.chipDisabledText,
                      ]}>
                        {t}{disabled ? " (listed)" : ""}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {hasDuplicateType && (
                <Text style={s.errorText}>You already have an active listing for this crop type.</Text>
              )}

              {/* Quality Grade */}
              <Text style={s.label}>Quality Grade *</Text>
              <View style={s.chipWrap}>
                {qualityGrades.map((g) => (
                  <TouchableOpacity
                    key={g}
                    activeOpacity={0.7}
                    style={[s.chip, qualityGrade === g && s.chipActive]}
                    onPress={() => setQualityGrade(qualityGrade === g ? "" : g)}
                  >
                    <Text style={[s.chipText, qualityGrade === g && s.chipActiveText]}>
                      Grade {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Quantity */}
              <Text style={s.label}>Quantity *</Text>
              <View style={s.row}>
                <TextInput
                  style={[s.input, { flex: 1 }]}
                  placeholder="e.g. 500"
                  placeholderTextColor={Colors.placeholder}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                />
                <View style={s.unitPicker}>
                  {units.map((u) => (
                    <TouchableOpacity
                      key={u}
                      activeOpacity={0.7}
                      style={[s.unitChip, unit === u && s.unitChipActive]}
                      onPress={() => setUnit(u)}
                    >
                      <Text style={[s.unitChipText, unit === u && s.unitChipTextActive]}>
                        {u}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price */}
              <Text style={s.label}>Price per Unit (₱) *</Text>
              <TextInput
                style={s.input}
                placeholder="e.g. 45"
                placeholderTextColor={Colors.placeholder}
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
              />

              {/* Harvest Date */}
              <Text style={s.label}>Harvest Date</Text>
              <TextInput
                style={s.input}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.placeholder}
                value={harvestDate}
                onChangeText={setHarvestDate}
              />

              {/* Crop Images */}
              <Text style={s.label}>Crop Image(s) * (at least 1)</Text>
              {images.length > 0 ? (
                <View style={s.imageList}>
                  {images.map((img, i) => (
                    <View key={i} style={s.imageThumb}>
                      <Text style={s.imagePlaceholder}>Image {i + 1}</Text>
                      <TouchableOpacity
                        style={s.removeImg}
                        onPress={() => setImages(images.filter((_, idx) => idx !== i))}
                      >
                        <Ionicons name="close-circle" size={18} color={Colors.error} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              ) : (
                <TouchableOpacity
                  style={s.uploadArea}
                  activeOpacity={0.7}
                  onPress={() => {
                    setImages(["https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"]);
                  }}
                >
                  <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
                  <Text style={s.uploadText}>Tap to add image</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={s.addImgBtn}
                activeOpacity={0.7}
                onPress={() => {
                  setImages([...images, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400"]);
                }}
              >
                <Ionicons name="add-circle-outline" size={16} color={Colors.primary} />
                <Text style={s.addImgText}>Add another image</Text>
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={s.sectionTitle}>Review & Confirm</Text>

              <View style={s.reviewCard}>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Crop Name</Text>
                  <Text style={s.reviewValue}>{name}</Text>
                </View>
                {description ? (
                  <View style={s.reviewRow}>
                    <Text style={s.reviewLabel}>Description</Text>
                    <Text style={s.reviewValue}>{description}</Text>
                  </View>
                ) : null}
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Type</Text>
                  <Text style={s.reviewValue}>{type}</Text>
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Grade</Text>
                  <Text style={s.reviewValue}>{qualityGrade}</Text>
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Quantity</Text>
                  <Text style={s.reviewValue}>{quantity} {unit}</Text>
                </View>
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Price</Text>
                  <Text style={s.reviewValue}>₱{price} / {unit}</Text>
                </View>
                {harvestDate ? (
                  <View style={s.reviewRow}>
                    <Text style={s.reviewLabel}>Harvest Date</Text>
                    <Text style={s.reviewValue}>{harvestDate}</Text>
                  </View>
                ) : null}
                <View style={s.reviewRow}>
                  <Text style={s.reviewLabel}>Images</Text>
                  <Text style={s.reviewValue}>{images.length} image{images.length !== 1 ? "s" : ""}</Text>
                </View>
              </View>

              {/* Schedule Tag */}
              <Text style={s.label}>Assign Schedule Tag *</Text>
              <View style={s.scheduleList}>
                {scheduleTags.map((st) => (
                  <TouchableOpacity
                    key={st.key}
                    activeOpacity={0.7}
                    style={[s.scheduleCard, scheduleTag === st.key && s.scheduleCardActive]}
                    onPress={() => setScheduleTag(scheduleTag === st.key ? "" : st.key)}
                  >
                    <Ionicons
                      name={st.icon as any}
                      size={22}
                      color={scheduleTag === st.key ? Colors.white : Colors.primary}
                    />
                    <Text style={[s.scheduleCardLabel, scheduleTag === st.key && s.scheduleCardLabelActive]}>
                      {st.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>

        {/* Bottom actions */}
        <View style={s.bottomBar}>
          {step === 1 ? (
            <TouchableOpacity
              activeOpacity={0.8}
              style={[s.primaryBtn, !isStep1Valid && s.btnDisabled]}
              onPress={() => setStep(2)}
              disabled={!isStep1Valid}
            >
              <Text style={s.primaryBtnText}>Next: Schedule</Text>
              <Ionicons name="arrow-forward" size={18} color={Colors.white} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={s.secondaryBtn}
                onPress={() => setStep(1)}
              >
                <Ionicons name="arrow-back" size={18} color={Colors.primary} />
                <Text style={s.secondaryBtnText}>Back</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={[s.primaryBtn, { flex: 1 }, !isStep2Valid && s.btnDisabled]}
                onPress={handleSubmit}
                disabled={!isStep2Valid}
              >
                <Text style={s.primaryBtnText}>Submit Listing</Text>
                <Ionicons name="checkmark" size={18} color={Colors.white} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = {
  header: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.white, alignItems: "center" as const, justifyContent: "center" as const },
  headerTitle: { fontSize: 18, fontWeight: "800" as const, color: Colors.text },
  stepRow: { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 8, marginBottom: 16, paddingHorizontal: 16 },
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotText: { fontSize: 12, fontWeight: "700" as const, color: Colors.textMuted },
  stepDotTextActive: { color: Colors.white },
  stepLine: { width: 60, height: 2, backgroundColor: Colors.border, borderRadius: 1 },
  stepLineActive: { backgroundColor: Colors.primary },
  scroll: { padding: 16, paddingBottom: 100 },
  label: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary, marginBottom: 8, marginTop: 12 },
  input: { backgroundColor: Colors.white, borderRadius: 12, paddingHorizontal: 16, height: 48, fontSize: 15, color: Colors.text },
  textArea: { height: 80, paddingTop: 14, textAlignVertical: "top" as const },
  chipWrap: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 8 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.white },
  chipActive: { backgroundColor: Colors.primary },
  chipDisabled: { opacity: 0.4 },
  chipText: { fontSize: 13, fontWeight: "600" as const, color: Colors.textSecondary },
  chipActiveText: { color: Colors.white },
  chipDisabledText: { color: Colors.textMuted },
  errorText: { fontSize: 11, color: Colors.error, marginTop: 4 },
  row: { flexDirection: "row" as const, gap: 8, alignItems: "flex-start" as const },
  unitPicker: { flexDirection: "row" as const, flexWrap: "wrap" as const, gap: 4, flex: 1 },
  unitChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, backgroundColor: Colors.surfaceAlt },
  unitChipActive: { backgroundColor: Colors.primary },
  unitChipText: { fontSize: 11, fontWeight: "600" as const, color: Colors.textSecondary },
  unitChipTextActive: { color: Colors.white },
  imageList: { flexDirection: "row" as const, gap: 8, flexWrap: "wrap" as const },
  imageThumb: {
    width: 80, height: 80, borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const, justifyContent: "center" as const,
  },
  imagePlaceholder: { fontSize: 10, color: Colors.primary },
  removeImg: { position: "absolute" as const, top: -6, right: -6 },
  uploadArea: {
    height: 100, borderRadius: 12, borderWidth: 2, borderStyle: "dashed" as const,
    borderColor: Colors.border, alignItems: "center" as const, justifyContent: "center" as const,
    gap: 6, backgroundColor: Colors.white,
  },
  uploadText: { fontSize: 12, color: Colors.textMuted },
  addImgBtn: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4, marginTop: 8 },
  addImgText: { fontSize: 12, fontWeight: "600" as const, color: Colors.primary },
  sectionTitle: { fontSize: 17, fontWeight: "700" as const, color: Colors.text, marginBottom: 14 },
  reviewCard: {
    backgroundColor: Colors.white, borderRadius: 14, padding: 14,
    marginBottom: 16, shadowColor: Colors.black, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  reviewRow: { flexDirection: "row" as const, justifyContent: "space-between" as const, paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  reviewLabel: { fontSize: 12, color: Colors.textMuted },
  reviewValue: { fontSize: 13, fontWeight: "600" as const, color: Colors.text, maxWidth: "60%" as const, textAlign: "right" as const },
  scheduleList: { gap: 8, marginBottom: 20 },
  scheduleCard: {
    flexDirection: "row" as const, alignItems: "center" as const, gap: 12,
    padding: 14, borderRadius: 12, backgroundColor: Colors.white,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  scheduleCardActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  scheduleCardLabel: { fontSize: 14, fontWeight: "600" as const, color: Colors.text },
  scheduleCardLabelActive: { color: Colors.white },
  bottomBar: {
    padding: 16, paddingBottom: 32,
    backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  primaryBtn: {
    flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const,
    gap: 6, backgroundColor: Colors.primary, borderRadius: 14, height: 50,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 10, elevation: 6,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700" as const, color: Colors.white },
  btnDisabled: { opacity: 0.5 },
  secondaryBtn: {
    flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const,
    gap: 6, borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 14, paddingHorizontal: 20, height: 50,
  },
  secondaryBtnText: { fontSize: 15, fontWeight: "700" as const, color: Colors.primary },
};
