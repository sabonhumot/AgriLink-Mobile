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

export default function LoginScreen() {
  const { top } = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(buyer)");
    }, 1000);
  };

  const isFocused = (name: string) => focusedField === name;

  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.32;

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

        {/* Centered Logo */}
        <View style={styles.logoSection}>
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
            <Text style={styles.heading}>Sign In</Text>
            <Text style={styles.subheading}>Welcome back! Sign in to continue</Text>

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
                  placeholder="Enter your password"
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

            {/* Remember / Forgot */}
            <View style={styles.row}>
              <TouchableOpacity
                onPress={() => setRememberMe(!rememberMe)}
                style={{ flexDirection: "row", alignItems: "center" }}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                  {rememberMe && (
                    <Ionicons name="checkmark" size={12} color={Colors.white} />
                  )}
                </View>
                <Text style={{ fontSize: 13, color: Colors.textSecondary, marginLeft: 8 }}>
                  Remember me
                </Text>
              </TouchableOpacity>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: Colors.primary }}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social */}
            <View style={styles.socialRow}>
              <TouchableOpacity activeOpacity={0.7} style={styles.socialBtn}>
                <Ionicons name="logo-google" size={18} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={20} color={Colors.text} />
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} style={styles.socialBtn}>
                <Ionicons name="call-outline" size={18} color={Colors.primary} />
              </TouchableOpacity>
            </View>

            {/* Sign Up */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
              <Text style={{ fontSize: 14, color: Colors.textSecondary }}>
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/register" asChild>
                <TouchableOpacity activeOpacity={0.7}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: Colors.primary }}>
                    Sign Up
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
  brandName: {
    fontSize: 24,
    fontWeight: "800" as const,
    color: Colors.white,
  },
  decoStem1: {
    position: "absolute" as const,
    width: 2,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: 30,
    left: 50,
    transform: [{ rotate: "15deg" }],
  },
  decoStem2: {
    position: "absolute" as const,
    width: 2,
    height: 60,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 50,
    left: 120,
    transform: [{ rotate: "-10deg" }],
  },
  decoStem3: {
    position: "absolute" as const,
    width: 2,
    height: 50,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 20,
    right: 80,
    transform: [{ rotate: "25deg" }],
  },
  decoDot1: {
    position: "absolute" as const,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: 40,
    left: 70,
  },
  decoDot2: {
    position: "absolute" as const,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: 70,
    right: 100,
  },
  decoLeaf1: {
    position: "absolute" as const,
    top: 35,
    left: 30,
  },
  decoLeaf2: {
    position: "absolute" as const,
    top: 80,
    right: 60,
  },
  card: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 24,
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
    marginBottom: 28,
  },
  field: {
    marginBottom: 18,
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
  row: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    marginBottom: 24,
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
  divider: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginVertical: 22,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.divider,
  },
  dividerText: {
    marginHorizontal: 14,
    fontSize: 12,
    color: Colors.textMuted,
  },
  socialRow: {
    flexDirection: "row" as const,
    gap: 14,
  },
  socialBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
};
