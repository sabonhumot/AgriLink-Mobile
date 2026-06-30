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

type Step = "email" | "otp" | "reset";

export default function ForgotPasswordScreen() {
  const { top } = useSafeAreaInsets();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSendOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("otp");
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep("reset");
    }, 1000);
  };

  const handleReset = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace("/(auth)/login");
    }, 1000);
  };

  const handleOtpChange = (val: string, idx: number) => {
    const newOtp = [...otp];
    newOtp[idx] = val;
    setOtp(newOtp);
    if (val && idx < 3) {
      const next = idx + 1;
      const input = refs[next];
      input?.focus();
    }
  };

  const refs: Record<number, TextInput | null> = {};

  const isFocused = (name: string) => focusedField === name;

  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.32;

  const stepConfig = {
    email: {
      icon: "mail-outline" as const,
      title: "Forgot Password",
      subtitle: "Enter your email to receive a reset code",
      buttonText: "Send Code",
    },
    otp: {
      icon: "keypad-outline" as const,
      title: "Enter Code",
      subtitle: `A 4-digit code was sent to ${email}`,
      buttonText: "Verify Code",
    },
    reset: {
      icon: "lock-open-outline" as const,
      title: "New Password",
      subtitle: "Create a new password for your account",
      buttonText: "Reset Password",
    },
  };

  const config = stepConfig[step];

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="light-content" />

      {/* Green Header */}
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
            <Text style={styles.heading}>{config.title}</Text>
            <Text style={styles.subheading}>{config.subtitle}</Text>

            {/* Step Indicator */}
            <View style={styles.stepRow}>
              {(["email", "otp", "reset"] as const).map((s, i) => (
                <View key={s} style={styles.stepItem}>
                  <View
                    style={[
                      styles.stepDot,
                      (step === s ||
                        (step === "otp" && s === "email") ||
                        (step === "reset" && (s === "email" || s === "otp"))) &&
                        styles.stepDotActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stepDotText,
                        (step === s ||
                          (step === "otp" && s === "email") ||
                          (step === "reset" && (s === "email" || s === "otp"))) &&
                          styles.stepDotTextActive,
                      ]}
                    >
                      {i + 1}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      step === s && styles.stepLabelActive,
                    ]}
                  >
                    {s === "email" ? "Email" : s === "otp" ? "OTP" : "Reset"}
                  </Text>
                </View>
              ))}
            </View>

            {/* Step 1: Email */}
            {step === "email" && (
              <View style={styles.field}>
                <Text style={styles.label}>Email Address</Text>
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
            )}

            {/* Step 2: OTP */}
            {step === "otp" && (
              <View style={styles.field}>
                <Text style={styles.label}>Enter OTP Code</Text>
                <View style={styles.otpRow}>
                  {otp.map((digit, idx) => (
                    <TextInput
                      key={idx}
                      ref={(ref) => {
                        refs[idx] = ref;
                      }}
                      style={[
                        styles.otpInput,
                        isFocused(`otp-${idx}`) && styles.otpInputFocused,
                      ]}
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
                  onPress={handleSendOtp}
                  activeOpacity={0.7}
                  style={{ alignSelf: "center", marginTop: 12 }}
                >
                  <Text style={{ fontSize: 13, color: Colors.primary, fontWeight: "600" }}>
                    Resend Code
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Step 3: Reset Password */}
            {step === "reset" && (
              <>
                <View style={styles.field}>
                  <Text style={styles.label}>New Password</Text>
                  <View style={[styles.input, isFocused("password") && styles.inputFocused]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={isFocused("password") ? Colors.primary : Colors.iconLight}
                    />
                    <TextInput
                      style={styles.inputText}
                      placeholder="Enter new password"
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

                <View style={styles.field}>
                  <Text style={styles.label}>Confirm Password</Text>
                  <View style={[styles.input, isFocused("confirm") && styles.inputFocused]}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={18}
                      color={isFocused("confirm") ? Colors.primary : Colors.iconLight}
                    />
                    <TextInput
                      style={styles.inputText}
                      placeholder="Confirm new password"
                      placeholderTextColor={Colors.placeholder}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                      secureTextEntry={!showConfirm}
                    />
                    <TouchableOpacity
                      onPress={() => setShowConfirm(!showConfirm)}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Ionicons
                        name={showConfirm ? "eye-outline" : "eye-off-outline"}
                        size={18}
                        color={Colors.iconLight}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}

            {/* Action Button */}
            <TouchableOpacity
              onPress={
                step === "email"
                  ? handleSendOtp
                  : step === "otp"
                    ? handleVerifyOtp
                    : handleReset
              }
              disabled={isLoading}
              activeOpacity={0.8}
              style={[styles.primaryButton, isLoading && { opacity: 0.7 }]}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryButtonText}>{config.buttonText}</Text>
              )}
            </TouchableOpacity>

            {/* Back to Login */}
            <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 24 }}>
              <TouchableOpacity
                onPress={() => router.back()}
                activeOpacity={0.7}
                style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
              >
                <Ionicons name="arrow-back" size={16} color={Colors.primary} />
                <Text style={{ fontSize: 14, fontWeight: "600", color: Colors.primary }}>
                  Back to Sign In
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
  stepRow: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    marginBottom: 28,
    gap: 24,
  },
  stepItem: {
    alignItems: "center" as const,
    gap: 6,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDotText: {
    fontSize: 14,
    fontWeight: "700" as const,
    color: Colors.textMuted,
  },
  stepDotTextActive: {
    color: Colors.white,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textMuted,
  },
  stepLabelActive: {
    color: Colors.primary,
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
  otpRow: {
    flexDirection: "row" as const,
    justifyContent: "center" as const,
    gap: 14,
  },
  otpInput: {
    width: 58,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceAlt,
    textAlign: "center" as const,
    fontSize: 22,
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
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
};
