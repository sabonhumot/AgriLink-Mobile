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

type Step = "form" | "submitted";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  coopMembershipId: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

export default function RegisterFarmerScreen() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    coopMembershipId: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [docUploaded, setDocUploaded] = useState(false);

  const set = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const isSpacesOnly = (v: string) => v.trim().length === 0 && v.length > 0;

  const passwordChecks = {
    length: form.password.length >= 8 && form.password.length <= 16,
    upper: /[A-Z]/.test(form.password),
    lower: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
    special: /[^A-Za-z0-9]/.test(form.password),
  };

  const validate = (): boolean => {
    const e: FormErrors = {};

    if (!form.firstName.trim()) e.firstName = "First name is required";
    else if (isSpacesOnly(form.firstName)) e.firstName = "Invalid name";

    if (!form.lastName.trim()) e.lastName = "Last name is required";
    else if (isSpacesOnly(form.lastName)) e.lastName = "Invalid name";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!isValidEmail(form.email)) e.email = "Invalid email format";

    if (!form.username.trim()) e.username = "Username is required";

    if (!form.password) e.password = "Password is required";
    else if (!Object.values(passwordChecks).every(Boolean))
      e.password = "Does not meet all requirements";

    if (!form.confirmPassword) e.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    if (!form.coopMembershipId.trim()) e.coopMembershipId = "Cooperative Membership ID is required";

    if (!docUploaded) e.coopMembershipId = "Please upload a supporting document";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("submitted");
    }, 1200);
  };

  const isFocused = (name: string) => focusedField === name;

  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.26;

  const Field = ({
    label,
    icon,
    value,
    onChangeText,
    placeholder,
    error,
    secureTextEntry,
    toggleSecure,
    showSecure,
    keyboardType,
    autoCapitalize,
    autoCorrect,
    focusKey,
    optional,
  }: {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    value: string;
    onChangeText: (v: string) => void;
    placeholder: string;
    error?: string;
    secureTextEntry?: boolean;
    toggleSecure?: () => void;
    showSecure?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    autoCorrect?: boolean;
    focusKey: string;
    optional?: boolean;
  }) => (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>
        {label} {optional && <Text style={{ color: Colors.textMuted, fontWeight: "400" }}>(optional)</Text>}
      </Text>
      <View
        style={[
          styles.input,
          isFocused(focusKey) && styles.inputFocused,
          error && { borderColor: Colors.error },
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={error ? Colors.error : isFocused(focusKey) ? Colors.primary : Colors.iconLight}
        />
        <TextInput
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={() => setFocusedField(focusKey)}
          onBlur={() => setFocusedField(null)}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || "default"}
          autoCapitalize={autoCapitalize || "none"}
          autoCorrect={autoCorrect ?? true}
        />
        {toggleSecure && (
          <TouchableOpacity onPress={toggleSecure} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={showSecure ? "eye-outline" : "eye-off-outline"}
              size={18}
              color={Colors.iconLight}
            />
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
          <Ionicons name="alert-circle" size={12} color={Colors.error} />
          <Text style={{ fontSize: 11, color: Colors.error }}>{error}</Text>
        </View>
      )}
    </View>
  );

  if (step === "submitted") {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.white }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 }}>
          <View style={styles.pendingCircle}>
            <Ionicons name="time-outline" size={36} color={Colors.white} />
          </View>
          <Text style={styles.pendingTitle}>Registration Submitted</Text>
          <Text style={styles.pendingDesc}>
            Your account is now awaiting coordinator approval. You will be notified once your
            registration has been reviewed. This usually takes 1–2 business days.
          </Text>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.primaryButton}
            onPress={() => router.replace("/(auth)/login")}
          >
            <Text style={styles.primaryButtonText}>Back to Sign In</Text>
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
            <Text style={styles.heading}>Farmer Registration</Text>
            <Text style={styles.subheading}>
              Join as a farmer and start listing your crops
            </Text>

            <Text style={styles.sectionLabel}>Personal Information</Text>

            <Field
              label="First Name"
              icon="person-outline"
              value={form.firstName}
              onChangeText={(v) => set("firstName", v)}
              placeholder="Juan"
              error={errors.firstName}
              focusKey="firstName"
              autoCapitalize="words"
            />
            <Field
              label="Middle Name"
              icon="person-outline"
              value={form.middleName}
              onChangeText={(v) => set("middleName", v)}
              placeholder="Dela"
              focusKey="middleName"
              autoCapitalize="words"
              optional
            />
            <Field
              label="Last Name"
              icon="person-outline"
              value={form.lastName}
              onChangeText={(v) => set("lastName", v)}
              placeholder="Cruz"
              error={errors.lastName}
              focusKey="lastName"
              autoCapitalize="words"
            />

            <Text style={[styles.sectionLabel, { marginTop: 8 }]}>Account Details</Text>

            <Field
              label="Email"
              icon="mail-outline"
              value={form.email}
              onChangeText={(v) => set("email", v)}
              placeholder="you@example.com"
              error={errors.email}
              focusKey="email"
              keyboardType="email-address"
            />
            <Field
              label="Username"
              icon="at-outline"
              value={form.username}
              onChangeText={(v) => set("username", v)}
              placeholder="juan_farmer"
              error={errors.username}
              focusKey="username"
            />
            <Field
              label="Password"
              icon="lock-closed-outline"
              value={form.password}
              onChangeText={(v) => set("password", v)}
              placeholder="Create a password"
              error={errors.password}
              secureTextEntry={!showPassword}
              toggleSecure={() => setShowPassword(!showPassword)}
              showSecure={showPassword}
              focusKey="password"
            />

            {form.password.length > 0 && (
              <View style={styles.passwordChecks}>
                {[
                  { key: "length", label: "8–16 characters" },
                  { key: "upper", label: "1 uppercase letter" },
                  { key: "lower", label: "1 lowercase letter" },
                  { key: "number", label: "1 number" },
                  { key: "special", label: "1 special character" },
                ].map((c) => {
                  const pass = passwordChecks[c.key as keyof typeof passwordChecks];
                  return (
                    <View key={c.key} style={styles.checkRow}>
                      <Ionicons
                        name={pass ? "checkmark-circle" : "ellipse-outline"}
                        size={12}
                        color={pass ? Colors.success : Colors.textMuted}
                      />
                      <Text style={[styles.checkText, pass && { color: Colors.success }]}>
                        {c.label}
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            <Field
              label="Confirm Password"
              icon="lock-closed-outline"
              value={form.confirmPassword}
              onChangeText={(v) => set("confirmPassword", v)}
              placeholder="Re-enter password"
              error={errors.confirmPassword}
              secureTextEntry={!showConfirm}
              toggleSecure={() => setShowConfirm(!showConfirm)}
              showSecure={showConfirm}
              focusKey="confirmPassword"
            />
            <Text style={[styles.sectionLabel, { marginTop: 16 }]}>
              Cooperative Membership
            </Text>

            <Field
              label="Cooperative Membership ID"
              icon="id-card-outline"
              value={form.coopMembershipId}
              onChangeText={(v) => set("coopMembershipId", v)}
              placeholder="e.g. COOP-2024-00123"
              error={errors.coopMembershipId && !docUploaded ? errors.coopMembershipId : undefined}
              focusKey="coopMembershipId"
              autoCapitalize="characters"
            />

            {/* Document Upload */}
            <View style={{ marginBottom: 14 }}>
              <Text style={styles.label}>Supporting Document</Text>
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.uploadBox,
                  docUploaded && styles.uploadBoxDone,
                  errors.coopMembershipId && !docUploaded && { borderColor: Colors.error },
                ]}
                onPress={() => setDocUploaded(!docUploaded)}
              >
                {docUploaded ? (
                  <>
                    <Ionicons name="document-text-outline" size={22} color={Colors.success} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.success }}>
                        membership_document.pdf
                      </Text>
                      <Text style={{ fontSize: 11, color: Colors.textMuted }}>
                        Tap to replace
                      </Text>
                    </View>
                    <Ionicons name="checkmark-circle" size={20} color={Colors.success} />
                  </>
                ) : (
                  <>
                    <Ionicons name="cloud-upload-outline" size={22} color={Colors.primary} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.text }}>
                        Upload Document
                      </Text>
                      <Text style={{ fontSize: 11, color: Colors.textMuted }}>
                        Photo or scan of membership ID
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
                  </>
                )}
              </TouchableOpacity>
              {errors.coopMembershipId && !docUploaded && (
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 }}>
                  <Ionicons name="alert-circle" size={12} color={Colors.error} />
                  <Text style={{ fontSize: 11, color: Colors.error }}>
                    {errors.coopMembershipId}
                  </Text>
                </View>
              )}
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              activeOpacity={0.8}
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Submit Registration</Text>
              )}
            </TouchableOpacity>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20, marginBottom: 20 }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")} activeOpacity={0.7}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700" as const,
    color: Colors.primary,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 12,
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
  passwordChecks: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 10,
    marginTop: -6,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  checkRow: { flexDirection: "row" as const, alignItems: "center" as const, gap: 4 },
  checkText: { fontSize: 11, color: Colors.textMuted },
  uploadBox: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed" as const,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  uploadBoxDone: {
    borderColor: Colors.success,
    borderStyle: "solid" as const,
    backgroundColor: Colors.successSurface,
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
  pendingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accent,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 20,
  },
  pendingTitle: {
    fontSize: 22,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 10,
    textAlign: "center" as const,
  },
  pendingDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center" as const,
    lineHeight: 20,
    marginBottom: 28,
  },
};
