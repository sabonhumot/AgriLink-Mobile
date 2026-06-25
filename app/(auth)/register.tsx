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
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");
type UserRole = "farmer" | "buyer";

export default function RegisterScreen() {
  const { top } = useSafeAreaInsets();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState<UserRole>("farmer");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleRegister = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(buyer)");
    }, 1000);
  };

  const roles: {
    value: UserRole;
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
  }[] = [
    { value: "farmer", label: "Farmer", icon: "leaf-outline" },
    { value: "buyer", label: "Buyer", icon: "cart-outline" },
  ];

  const isFocused = (name: string) => focusedField === name;

  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.2;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="light-content" />

      {/* Green Header */}
      <View style={[styles.header, { height: topSectionHeight, paddingTop: top }]}>
        {/* Decorative plant art */}
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

        {/* Logo top-right */}
        <View style={[styles.logoWrap, { top: top + 12 }]}>
          <Image
            source={require("@/assets/images/AgriLink.png")}
            style={styles.logoImage}
          />
        </View>
      </View>

      {/* SVG Wave */}
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

      {/* Form */}
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
            <Text style={styles.heading}>Create Account</Text>
            <Text style={styles.subheading}>Set up your AgriLink profile</Text>

            {/* Role Selection */}
            <View style={styles.field}>
              <Text style={styles.label}>I am a...</Text>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {roles.map((r) => {
                  const isActive = role === r.value;
                  return (
                    <TouchableOpacity
                      key={r.value}
                      onPress={() => setRole(r.value)}
                      activeOpacity={0.7}
                      style={[styles.roleCard, isActive && styles.roleCardActive]}
                    >
                      <View
                        style={[
                          styles.roleIconCircle,
                          isActive && styles.roleIconCircleActive,
                        ]}
                      >
                        <Ionicons
                          name={r.icon}
                          size={20}
                          color={isActive ? Colors.white : Colors.primary}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: "700",
                          color: isActive ? Colors.primary : Colors.text,
                        }}
                      >
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Full Name */}
            <View style={styles.field}>
              <Text style={styles.label}>Full Name</Text>
              <View style={[styles.input, isFocused("fullName") && styles.inputFocused]}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color={isFocused("fullName") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Juan Dela Cruz"
                  placeholderTextColor={Colors.placeholder}
                  value={fullName}
                  onChangeText={setFullName}
                  onFocus={() => setFocusedField("fullName")}
                  onBlur={() => setFocusedField(null)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            {/* Email */}
            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <View style={[styles.input, isFocused("email") && styles.inputFocused]}>
                <Ionicons
                  name="mail-outline"
                  size={18}
                  color={isFocused("email") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.placeholder}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Phone */}
            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={[styles.input, isFocused("phone") && styles.inputFocused]}>
                <Ionicons
                  name="call-outline"
                  size={18}
                  color={isFocused("phone") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="+63 9XX XXX XXXX"
                  placeholderTextColor={Colors.placeholder}
                  value={phone}
                  onChangeText={setPhone}
                  onFocus={() => setFocusedField("phone")}
                  onBlur={() => setFocusedField(null)}
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            {/* Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Password</Text>
              <View style={[styles.input, isFocused("password") && styles.inputFocused]}>
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={isFocused("password") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Create a password"
                  placeholderTextColor={Colors.placeholder}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={Colors.iconLight}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View style={styles.field}>
              <Text style={styles.label}>Confirm Password</Text>
              <View
                style={[
                  styles.input,
                  isFocused("confirmPassword") && styles.inputFocused,
                  confirmPassword.length > 0 && {
                    borderColor:
                      confirmPassword === password ? Colors.success : Colors.error,
                  },
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={18}
                  color={isFocused("confirmPassword") ? Colors.primary : Colors.iconLight}
                />
                <TextInput
                  style={styles.inputText}
                  placeholder="Re-enter password"
                  placeholderTextColor={Colors.placeholder}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onFocus={() => setFocusedField("confirmPassword")}
                  onBlur={() => setFocusedField(null)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={Colors.iconLight}
                  />
                </TouchableOpacity>
              </View>
              {confirmPassword.length > 0 && (
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 6, gap: 5 }}>
                  <Ionicons
                    name={confirmPassword === password ? "checkmark-circle" : "close-circle"}
                    size={14}
                    color={confirmPassword === password ? Colors.success : Colors.error}
                  />
                  <Text
                    style={{
                      fontSize: 12,
                      color: confirmPassword === password ? Colors.success : Colors.error,
                      fontWeight: "500",
                    }}
                  >
                    {confirmPassword === password ? "Passwords match" : "Passwords do not match"}
                  </Text>
                </View>
              )}
            </View>

            {/* Terms */}
            <TouchableOpacity
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              activeOpacity={0.7}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginTop: 8,
                marginBottom: 22,
              }}
            >
              <View style={[styles.checkbox, agreeToTerms && styles.checkboxChecked]}>
                {agreeToTerms && (
                  <Ionicons name="checkmark" size={12} color={Colors.white} />
                )}
              </View>
              <Text
                style={{
                  fontSize: 13,
                  color: Colors.textSecondary,
                  flex: 1,
                  lineHeight: 19,
                  marginLeft: 10,
                }}
              >
                I agree to the{" "}
                <Text style={{ fontWeight: "700", color: Colors.primary }}>Terms of Service</Text>{" "}
                and{" "}
                <Text style={{ fontWeight: "700", color: Colors.primary }}>Privacy Policy</Text>
              </Text>
            </TouchableOpacity>

            {/* Register Button */}
            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading || !agreeToTerms}
              activeOpacity={0.8}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: agreeToTerms ? Colors.primary : Colors.disabled,
                  opacity: isLoading ? 0.7 : 1,
                },
              ]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "700",
                    color: agreeToTerms ? Colors.white : Colors.disabledText,
                  }}
                >
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 22 }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
                Already have an account?{" "}
              </Text>
              <Link href="/(auth)/login" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>
                    Sign In
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = {
  header: {
    backgroundColor: Colors.primary,
  },
  logoWrap: {
    position: "absolute" as const,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  logoImage: {
    width: 26,
    height: 26,
    resizeMode: "contain" as const,
    tintColor: Colors.white,
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
    marginBottom: 24,
  },
  field: {
    marginBottom: 16,
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
  roleCard: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center" as const,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    gap: 8,
  },
  roleCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primarySurface,
  },
  roleIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.primarySurface,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  roleIconCircleActive: {
    backgroundColor: Colors.primary,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  primaryButton: {
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
};
