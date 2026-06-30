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

type Step = "role" | "form" | "otp";

interface FormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = Partial<Record<keyof FormData, string>>;

const MOCK_REGISTERED_EMAILS = ["maria@example.com", "juan@example.com"];
const MOCK_REGISTERED_USERNAMES = ["maria", "juan", "admin", "user"];

export default function RegisterScreen() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("role");
  const [form, setForm] = useState<FormData>({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
    else if (MOCK_REGISTERED_EMAILS.includes(form.email.toLowerCase()))
      e.email = "Email already registered";

    if (!form.username.trim()) e.username = "Username is required";
    else if (MOCK_REGISTERED_USERNAMES.includes(form.username.toLowerCase()))
      e.username = "Username already taken";

    if (!form.password) e.password = "Password is required";
    else if (!Object.values(passwordChecks).every(Boolean))
      e.password = "Does not meet all requirements";

    if (!form.confirmPassword) e.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1200);
  };

  const handleOtpChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 5) {
      const next = idx + 1;
      refs[next]?.focus();
    }
  };

  const refs: Record<number, TextInput | null> = {};

  const handleVerifyOtp = () => {
    if (otp.some((d) => !d)) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(auth)/onboarding");
    }, 1000);
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

        {step !== "role" && (
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => step === "form" ? setStep("role") : router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        )}

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
        {step === "role" ? (
          <View style={styles.card}>
            <View style={styles.accentLine} />
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Choose your account type</Text>

            <View style={{ flexDirection: "row", gap: 14, marginTop: 8 }}>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.roleCard}
                onPress={() => setStep("form")}
              >
                <View style={styles.roleIconCircle}>
                  <Ionicons name="cart-outline" size={22} color={Colors.primary} />
                </View>
                <Text style={styles.roleLabel}>Buyer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.roleCard}
                onPress={() => router.push("/(auth)/register-farmer")}
              >
                <View style={styles.roleIconCircle}>
                  <Ionicons name="leaf-outline" size={22} color={Colors.primary} />
                </View>
                <Text style={styles.roleLabel}>Farmer</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 28 }}>
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
        ) : step === "form" ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
              <View style={styles.accentLine} />
              <Text style={styles.heading}>Buyer Registration</Text>
              <Text style={styles.subheading}>
                Join as a buyer and start exploring the marketplace
              </Text>

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
                placeholder="juan123"
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

              <TouchableOpacity
                onPress={handleSubmit}
                disabled={isLoading}
                activeOpacity={0.8}
                style={[styles.primaryButton, isLoading && { opacity: 0.7 }, { marginTop: 8 }]}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>Continue</Text>
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
        ) : (
          /* OTP Step */
          <View style={styles.card}>
            <View style={styles.accentLine} />
            <Text style={styles.heading}>Verify Your Email</Text>
            <Text style={styles.subheading}>
              A 6-digit code was sent to{" "}
              <Text style={{ fontWeight: "700", color: Colors.text }}>{form.email}</Text>
            </Text>

            <View style={{ marginTop: 16, marginBottom: 28 }}>
              <View style={styles.otpRow}>
                {otp.map((digit, idx) => (
                  <TextInput
                    key={idx}
                    ref={(ref) => { refs[idx] = ref; }}
                    style={[styles.otpInput, isFocused(`otp-${idx}`) && styles.otpInputFocused]}
                    value={digit}
                    onChangeText={(v) => handleOtpChange(v, idx)}
                    onFocus={() => setFocusedField(`otp-${idx}`)}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>
              <TouchableOpacity
                onPress={() => { setOtp(["", "", "", "", "", ""]); refs[0]?.focus(); }}
                activeOpacity={0.7}
                style={{ alignSelf: "center", marginTop: 16 }}
              >
                <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: "600" }}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleVerifyOtp}
              disabled={isLoading || otp.some((d) => !d)}
              activeOpacity={0.8}
              style={[styles.primaryButton, { backgroundColor: otp.some((d) => !d) ? Colors.disabled : Colors.primary, opacity: isLoading ? 0.7 : 1 }]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={[styles.primaryButtonText, { color: otp.some((d) => !d) ? Colors.disabledText : Colors.white }]}>
                  Verify & Continue
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setStep("form")}
              activeOpacity={0.7}
              style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 20 }}
            >
              <Ionicons name="arrow-back" size={16} color={Colors.primary} />
              <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.primary }}>
                Back to form
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
  roleCard: {
    flex: 1,
    paddingVertical: 18,
    alignItems: "center" as const,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 10,
  },
  roleIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  roleLabel: {
    fontSize: 15,
    fontWeight: "700" as const,
    color: Colors.text,
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
  otpRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 10,
  },
  otpInput: {
    width: 46,
    height: 54,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    textAlign: "center" as const,
    fontSize: 20,
    fontWeight: "700" as const,
    color: Colors.text,
  },
  otpInputFocused: {
    borderColor: Colors.borderFocused,
    backgroundColor: Colors.white,
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
};
