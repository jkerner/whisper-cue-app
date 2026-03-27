import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";

export default function PracticeCompleteScreen() {
  const router = useRouter();

  // Fade in everything
  const fadeAnim = useRef(new Animated.Value(0)).current;
  // Float the image gently
  const floatAnim = useRef(new Animated.Value(0)).current;
  // Glow ring pulse
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Gentle float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Ring pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.8,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 2500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
        {/* Floating pose image with pulsing ring */}
        <Animated.View
          style={[styles.imageArea, { transform: [{ translateY: floatAnim }] }]}
        >
          <Animated.View style={[styles.glowRing, { opacity: pulseAnim }]} />
          <Image
            source={require("../assets/poses/sukhasana.png")}
            style={styles.poseImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Title */}
        <Text style={styles.title}>Practice Complete</Text>

        {/* Eyebrow */}
        <Text style={styles.eyebrow}>NAMASTE</Text>

        {/* Breathe cue */}
        <Text style={styles.breatheCue}>
          Let the breath return to its natural rhythm.
          {"\n\n"}
          You rooted down. You rose up.
          {"\n"}
          You gave your students a beautiful practice.
        </Text>

        {/* Return CTA */}
        <Pressable
          style={styles.cta}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.ctaText}>RETURN HOME</Text>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#030303",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },

  // Floating image + glow
  imageArea: {
    width: 160,
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
  },
  glowRing: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 1.5,
    borderColor: "#43B1E8",
  },
  poseImage: {
    width: 120,
    height: 120,
  },

  // Title — Cormorant Garamond Light Italic
  title: {
    color: "#F8F9FA",
    fontSize: 36,
    fontFamily: "CormorantGaramond-LightItalic",
    marginBottom: 12,
  },

  // Eyebrow — SQ Market role
  eyebrow: {
    color: "#43B1E8",
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 4,
    marginBottom: 32,
  },

  // Breathe cue — Cormorant Garamond Italic
  breatheCue: {
    color: "#7999C1",
    fontSize: 17,
    fontFamily: "CormorantGaramond-Italic",
    textAlign: "center",
    lineHeight: 28,
    marginBottom: 48,
    maxWidth: 300,
  },

  // CTA — SQ Market role, uppercase, outline
  cta: {
    borderWidth: 1,
    borderColor: "#7999C1",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 48,
  },
  ctaText: {
    color: "#F8F9FA",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 3,
  },
});
