import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  StatusBar,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type Step = "onboarding" | "success";

interface OnboardingData {
  contactNumber: string;
  street: string;
  barangay: string;
  city: string;
  zipCode: string;
  region: string;
}

type FormErrors = Partial<Record<keyof OnboardingData, string>>;

export default function OnboardingScreen() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("onboarding");
  const [form, setForm] = useState<OnboardingData>({
    contactNumber: "",
    street: "",
    barangay: "",
    city: "",
    zipCode: "",
    region: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState(false);

  const set = (key: keyof OnboardingData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!profileImage) e.contactNumber = "Profile image is required";

    if (!form.contactNumber.trim()) e.contactNumber = "Contact number is required";
    else if (!/^\d{11}$/.test(form.contactNumber.replace(/\D/g, "")))
      e.contactNumber = "Must be 11 digits";

    if (!form.street.trim()) e.street = "Required";
    if (!form.barangay.trim()) e.barangay = "Required";
    if (!form.city.trim()) e.city = "Required";
    if (!form.zipCode.trim()) e.zipCode = "Required";
    if (!form.region.trim()) e.region = "Required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("success");
    }, 1200);
  };

  const isFocused = (name: string) => focusedField === name;

  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.26;

  if (step === "success") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={40} color={Colors.white} />
          </View>
          <Text style={styles.successTitle}>All Set!</Text>
          <Text style={styles.successDesc}>
            Your profile is complete. You can now start browsing crops from local farmers.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.primaryButton}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.primaryButtonText}>Go to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="light-content" />

      <View style={[styles.header, { height: topSectionHeight, paddingTop: top }]}>
        <View style={styles.decoStem1} />
        <View style={styles.decoStem2} />
        <View style={styles.decoStem3} />
        <View style={styles.decoDot1} />
        <View style={styles.decoDot2} />
        <View style={styles.decoLeaf1}>
          <Ionicons name="leaf-outline" size={24} color="rgba(255,255,255,0.15)" />
        </View>
        <View style={styles.decoLeaf2}>
          <Ionicons name="leaf-outline" size={18} color="rgba(255,255,255,0.12)" />
        </View>

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </TouchableOpacity>

        <View style={styles.logoSection}>
          <Image source={require("@/assets/images/AgriLink.png")} style={styles.logoImage} />
        </View>
      </View>

      <View style={{ marginTop: -waveHeight, height: waveHeight }}>
        <Svg width={SCREEN_W} height={waveHeight} viewBox={`0 0 ${SCREEN_W} ${waveHeight}`}>
          <Path
            d={`M0,0 L0,${waveHeight * 0.4} Q${SCREEN_W * 0.25},${waveHeight} ${SCREEN_W * 0.5},${waveHeight * 0.6} Q${SCREEN_W * 0.75},${waveHeight * 0.2} ${SCREEN_W},${waveHeight * 0.5} L${SCREEN_W},0 Z`}
            fill={Colors.primary}
          />
          <Path
            d={`M0,${waveHeight * 0.4} Q${SCREEN_W * 0.25},${waveHeight} ${SCREEN_W * 0.5},${waveHeight * 0.6} Q${SCREEN_W * 0.75},${waveHeight * 0.2} ${SCREEN_W},${waveHeight * 0.5} L${SCREEN_W},${waveHeight} L0,${waveHeight} Z`}
            fill={Colors.white}
          />
        </Svg>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.accentLine} />
            <Text style={styles.heading}>Complete Your Profile</Text>
            <Text style={styles.subheading}>
              Just a few more details to finish setting up your account
            </Text>

            {/* Step indicator */}
            <View style={styles.stepIndicator}>
              <View style={styles.stepDone}>
                <Ionicons name="checkmark" size={12} color={Colors.white} />
              </View>
              <View style={styles.stepLine} />
              <View style={styles.stepActive}>
                <Text style={styles.stepActiveText}>2</Text>
              </View>
            </View>

            {/* Profile Image */}
            <View style={{ alignItems: "center", marginBottom: 24 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[styles.profilePicker, profileImage && styles.profilePickerDone]}
                onPress={() => setProfileImage(!profileImage)}
              >
                {profileImage ? (
                  <View style={styles.profileInner}>
                    <Ionicons name="person" size={32} color={Colors.primary} />
                    <View style={styles.profileBadge}>
                      <Ionicons name="camera" size={10} color={Colors.white} />
                    </View>
                  </View>
                ) : (
                  <Ionicons name="camera-outline" size={28} color={Colors.textMuted} />
                )}
              </TouchableOpacity>
              <Text style={{ fontSize: 11, color: Colors.textMuted, marginTop: 6 }}>
                {profileImage ? "Profile image set" : "Add a profile photo (required)"}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>Contact Information</Text>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>Contact Number</Text>
              <View
                style={[
                  styles.input,
                  isFocused("contactNumber") && styles.inputFocused,
                  errors.contactNumber && !profileImage
                    ? { borderColor: Colors.error }
                    : errors.contactNumber
                      ? { borderColor: Colors.error }
                      : undefined,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={errors.contactNumber ? Colors.error : isFocused("contactNumber") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="09171234567"
                  placeholderTextColor={Colors.placeholder}
                  value={form.contactNumber}
                  onChangeText={(v) => set("contactNumber", v)}
                  onFocus={() => setFocusedField("contactNumber")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                />
              </View>
              {errors.contactNumber && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Ionicons name="alert-circle" size={12} color={Colors.error} />
                  <Text style={{ fontSize: 11, color: Colors.error }}>{errors.contactNumber}</Text>
                </View>
              )}
            </View>

            <Text style={styles.sectionLabel}>Address</Text>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>Street / Building</Text>
              <View style={[styles.input, isFocused("street") && styles.inputFocused, errors.street && { borderColor: Colors.error }]}>
                <Ionicons name="home-outline" size={18} color={errors.street ? Colors.error : isFocused("street") ? Colors.primary : Colors.iconLight} />
                <TextInput style={styles.inputText} placeholder="123 Rizal Ave" placeholderTextColor={Colors.placeholder} value={form.street} onChangeText={(v) => set("street", v)} onFocus={() => setFocusedField("street")} onBlur={() => setFocusedField(null)} autoCapitalize="sentences" />
              </View>
              {errors.street && <Text style={styles.fieldError}>{errors.street}</Text>}
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>Barangay</Text>
              <View style={[styles.input, isFocused("barangay") && styles.inputFocused, errors.barangay && { borderColor: Colors.error }]}>
                <Ionicons name="location-outline" size={18} color={errors.barangay ? Colors.error : isFocused("barangay") ? Colors.primary : Colors.iconLight} />
                <TextInput style={styles.inputText} placeholder="Barangay San Isidro" placeholderTextColor={Colors.placeholder} value={form.barangay} onChangeText={(v) => set("barangay", v)} onFocus={() => setFocusedField("barangay")} onBlur={() => setFocusedField(null)} autoCapitalize="sentences" />
              </View>
              {errors.barangay && <Text style={styles.fieldError}>{errors.barangay}</Text>}
            </View>

            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>City / Municipality</Text>
              <View style={[styles.input, isFocused("city") && styles.inputFocused, errors.city && { borderColor: Colors.error }]}>
                <Ionicons name="location-outline" size={18} color={errors.city ? Colors.error : isFocused("city") ? Colors.primary : Colors.iconLight} />
                <TextInput style={styles.inputText} placeholder="Makati City" placeholderTextColor={Colors.placeholder} value={form.city} onChangeText={(v) => set("city", v)} onFocus={() => setFocusedField("city")} onBlur={() => setFocusedField(null)} autoCapitalize="sentences" />
              </View>
              {errors.city && <Text style={styles.fieldError}>{errors.city}</Text>}
            </View>

            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Zip Code</Text>
                <View style={[styles.input, isFocused("zipCode") && styles.inputFocused, errors.zipCode && { borderColor: Colors.error }]}>
                  <Ionicons name="map-outline" size={18} color={errors.zipCode ? Colors.error : isFocused("zipCode") ? Colors.primary : Colors.iconLight} />
                  <TextInput style={styles.inputText} placeholder="1200" placeholderTextColor={Colors.placeholder} value={form.zipCode} onChangeText={(v) => set("zipCode", v)} onFocus={() => setFocusedField("zipCode")} onBlur={() => setFocusedField(null)} keyboardType="numeric" />
                </View>
                {errors.zipCode && <Text style={styles.fieldError}>{errors.zipCode}</Text>}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Region</Text>
                <View style={[styles.input, isFocused("region") && styles.inputFocused, errors.region && { borderColor: Colors.error }]}>
                  <Ionicons name="map-outline" size={18} color={errors.region ? Colors.error : isFocused("region") ? Colors.primary : Colors.iconLight} />
                  <TextInput style={styles.inputText} placeholder="NCR" placeholderTextColor={Colors.placeholder} value={form.region} onChangeText={(v) => set("region", v)} onFocus={() => setFocusedField("region")} onBlur={() => setFocusedField(null)} autoCapitalize="characters" />
                </View>
                {errors.region && <Text style={styles.fieldError}>{errors.region}</Text>}
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }, { marginTop: 24 }]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Complete Setup</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  header: { backgroundColor: Colors.primary },
  logoSection: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoImage: {
    width: 80,
    height: 80,
    resizeMode: "contain" as const,
    tintColor: Colors.white,
    marginBottom: 12,
  },
  decoStem1: {
    position: "absolute" as const,
    width: 2,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: 20,
    left: 40,
    transform: [{ rotate: "15deg" }],
  },
  decoStem2: {
    position: "absolute" as const,
    width: 2,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 35,
    left: 100,
    transform: [{ rotate: "-10deg" }],
  },
  decoStem3: {
    position: "absolute" as const,
    width: 2,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 15,
    right: 70,
    transform: [{ rotate: "25deg" }],
  },
  decoDot1: {
    position: "absolute" as const,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: 30,
    left: 60,
  },
  decoDot2: {
    position: "absolute" as const,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: 50,
    right: 90,
  },
  decoLeaf1: {
    position: "absolute" as const,
    top: 25,
    left: 25,
  },
  decoLeaf2: {
    position: "absolute" as const,
    top: 60,
    right: 50,
  },
  card: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 40,
  },
  accentLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 6,
  },
  subheading: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
  },
  stepIndicator: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 24,
    gap: 0,
  },
  stepDone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.success,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.success,
    marginHorizontal: 8,
  },
  stepActive: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  stepActiveText: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 12,
  },
  profilePicker: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: "dashed" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  profilePickerDone: {
    borderColor: Colors.primary,
    borderStyle: "solid" as const,
    backgroundColor: Colors.primarySurface,
  },
  profileInner: {
    position: "relative" as const,
  },
  profileBadge: {
    position: "absolute" as const,
    bottom: -2,
    right: -12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  label: {
    fontSize: 13,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 52,
    gap: 12,
  },
  inputFocused: {
    borderColor: Colors.borderFocused,
    backgroundColor: Colors.white,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    height: "100%" as const,
  },
  fieldError: {
    fontSize: 11,
    color: Colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    height: 54,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  backBtn: {
    position: "absolute" as const,
    top: 12,
    left: 12,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    zIndex: 10,
  },
  successCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 10,
    textAlign: "center" as const,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 28,
  },
};
