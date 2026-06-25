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
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cropTypes, CropType, Availability } from "@/data/crops";

export default function AddListingScreen() {
  const { top } = useSafeAreaInsets();
  const [name, setName] = useState("");
  const [type, setType] = useState<CropType | "">("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState<Availability | "">("");
  const [harvestDate, setHarvestDate] = useState("");

  const handleSubmit = () => {
    if (!name.trim() || !type || !quantity.trim() || !price.trim() || !availability) {
      Alert.alert("Incomplete", "Please fill in all required fields.");
      return;
    }
    Alert.alert("Listed", `${name} has been added to your listings.`);
    setName("");
    setType("");
    setQuantity("");
    setPrice("");
    setAvailability("");
    setHarvestDate("");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAF9" }}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.header, { paddingTop: top + 12 }]}>
            <Text style={styles.headerTitle}>Add Listing</Text>
            <Text style={styles.headerDesc}>List your crop for buyers to discover</Text>
          </View>

          {/* Crop Name */}
          <Text style={styles.label}>Crop Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Fresh White Rice"
            placeholderTextColor={Colors.placeholder}
            value={name}
            onChangeText={setName}
          />

          {/* Type */}
          <Text style={styles.label}>Crop Type *</Text>
          <View style={styles.chipWrap}>
            {cropTypes.map((t) => (
              <TouchableOpacity
                key={t}
                activeOpacity={0.7}
                style={[styles.chip, type === t && styles.chipActive]}
                onPress={() => setType(type === t ? "" : t)}
              >
                <Text style={[styles.chipText, type === t && styles.chipActiveText]}>
                  {t}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Quantity */}
          <Text style={styles.label}>Quantity *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 500 kg"
            placeholderTextColor={Colors.placeholder}
            value={quantity}
            onChangeText={setQuantity}
          />

          {/* Price */}
          <Text style={styles.label}>Price per Unit (₱) *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 45"
            placeholderTextColor={Colors.placeholder}
            keyboardType="numeric"
            value={price}
            onChangeText={setPrice}
          />

          {/* Availability */}
          <Text style={styles.label}>Availability *</Text>
          <View style={styles.chipWrap}>
            {(["In Stock", "Limited", "Pre-order"] as Availability[]).map((a) => (
              <TouchableOpacity
                key={a}
                activeOpacity={0.7}
                style={[styles.chip, availability === a && styles.chipActive]}
                onPress={() => setAvailability(availability === a ? "" : a)}
              >
                <Text style={[styles.chipText, availability === a && styles.chipActiveText]}>
                  {a}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Harvest Date */}
          <Text style={styles.label}>Harvest Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={Colors.placeholder}
            value={harvestDate}
            onChangeText={setHarvestDate}
          />

          {/* Submit */}
          <TouchableOpacity activeOpacity={0.8} style={styles.submitBtn} onPress={handleSubmit}>
            <Ionicons name="add-circle-outline" size={20} color={Colors.white} />
            <Text style={styles.submitText}>Add Listing</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800" as const,
    color: Colors.text,
  },
  headerDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 8,
  },
  chipWrap: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  chipActiveText: {
    color: Colors.white,
  },
  submitBtn: {
    flexDirection: "row" as const,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 8,
    marginTop: 16,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
};
