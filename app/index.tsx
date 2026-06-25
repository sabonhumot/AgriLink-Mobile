import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Alert,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { Link, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export default function GetStartedScreen() {
  const { top } = useSafeAreaInsets();
  const waveHeight = 50;
  const topSectionHeight = SCREEN_H * 0.45;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.white }}>
      <StatusBar barStyle="light-content" />

      {/* Green Top Section */}
      <View style={[styles.topSection, { height: topSectionHeight, paddingTop: top }]}>
        {/* Decorative plant art */}
        <View style={styles.decoStem1} />
        <View style={styles.decoStem2} />
        <View style={styles.decoStem3} />
        <View style={styles.decoDot1} />
        <View style={styles.decoDot2} />
        <View style={styles.decoDot3} />
        <View style={styles.decoLeaf1}>
          <Ionicons name="leaf-outline" size={28} color="rgba(255,255,255,0.15)" />
        </View>
        <View style={styles.decoLeaf2}>
          <Ionicons name="leaf-outline" size={20} color="rgba(255,255,255,0.12)" />
        </View>
        <View style={styles.decoLeaf3}>
          <Ionicons name="leaf-outline" size={16} color="rgba(255,255,255,0.1)" />
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

      {/* Content */}
        <View style={styles.content}>
          <View style={styles.accentLine} />
          <Text style={styles.title}>Welcome</Text>
        <Text style={styles.desc}>
          A place where you can discover fresh agricultural products directly
          from local farmers.
        </Text>

        <View style={{ flex: 1 }} />

        {/* Test Buttons - For Testing Only */}
        <View style={styles.testSection}>
          <Text style={styles.testLabel}>Testing Access</Text>
          <View style={styles.testGrid}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.testButton}
              onPress={() => router.replace("/(buyer)")}
            >
              <Ionicons name="cart-outline" size={20} color={Colors.primary} />
              <Text style={styles.testButtonText}>Buyer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.testButton}
              onPress={() => router.replace("/(farmer)")}
            >
              <Ionicons name="leaf-outline" size={20} color={Colors.primary} />
              <Text style={styles.testButtonText}>Farmer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.testButton}
              onPress={() => Alert.alert("Coming Soon", "Cooperative screen not yet built")}
            >
              <Ionicons name="people-outline" size={20} color={Colors.primary} />
              <Text style={styles.testButtonText}>Coop</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.testButton}
              onPress={() => Alert.alert("Coming Soon", "Coordinator screen not yet built")}
            >
              <Ionicons name="clipboard-outline" size={20} color={Colors.primary} />
              <Text style={styles.testButtonText}>Coordinator</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.buttons}>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(auth)/register" asChild>
            <TouchableOpacity activeOpacity={0.8} style={styles.signupButton}>
              <Text style={styles.signupButtonText}>Sign up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}

const styles = {
  topSection: {
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
    height: 120,
    backgroundColor: "rgba(255,255,255,0.08)",
    top: 40,
    left: 60,
    transform: [{ rotate: "15deg" }],
  },
  decoStem2: {
    position: "absolute" as const,
    width: 2,
    height: 100,
    backgroundColor: "rgba(255,255,255,0.06)",
    top: 80,
    left: 140,
    transform: [{ rotate: "-10deg" }],
  },
  decoStem3: {
    position: "absolute" as const,
    width: 2,
    height: 80,
    backgroundColor: "rgba(255,255,255,0.05)",
    top: 30,
    right: 100,
    transform: [{ rotate: "25deg" }],
  },
  decoDot1: {
    position: "absolute" as const,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.15)",
    top: 60,
    left: 80,
  },
  decoDot2: {
    position: "absolute" as const,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.12)",
    top: 100,
    right: 120,
  },
  decoDot3: {
    position: "absolute" as const,
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "rgba(255,255,255,0.1)",
    bottom: 80,
    left: 120,
  },
  decoLeaf1: {
    position: "absolute" as const,
    top: 50,
    left: 40,
  },
  decoLeaf2: {
    position: "absolute" as const,
    top: 120,
    right: 80,
  },
  decoLeaf3: {
    position: "absolute" as const,
    bottom: 60,
    left: 100,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  accentLine: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "800" as const,
    color: Colors.text,
    marginBottom: 12,
  },
  desc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 40,
  },
  buttons: {
    gap: 14,
  },
  loginButton: {
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
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: Colors.white,
  },
  signupButton: {
    borderRadius: 14,
    height: 54,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  signupButtonText: {
    fontSize: 15,
    fontWeight: "600" as const,
    color: Colors.textSecondary,
  },
  testSection: {
    marginBottom: 20,
  },
  testLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.textMuted,
    textTransform: "uppercase" as const,
    letterSpacing: 1,
    marginBottom: 10,
  },
  testGrid: {
    flexDirection: "row" as const,
    gap: 10,
  },
  testButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.primarySurface,
    borderWidth: 1,
    borderColor: Colors.primary + "30",
    alignItems: "center" as const,
    justifyContent: "center" as const,
    gap: 4,
  },
  testButtonText: {
    fontSize: 11,
    fontWeight: "600" as const,
    color: Colors.primary,
  },
};
