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

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scalePop = useRef(new Animated.Value(0.6)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const ringScale = useRef(new Animated.Value(0.8)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const btnFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. Icon pops in with scale
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scalePop, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Ring expands outward
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(ringScale, {
          toValue: 1,
          friction: 5,
          tension: 30,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // 3. Text fades in after icon
    Animated.sequence([
      Animated.delay(900),
      Animated.timing(textFade, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Button fades in last
    Animated.sequence([
      Animated.delay(1800),
      Animated.timing(btnFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Gentle continuous float
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -6,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Floating icon with expanding ring */}
        <Animated.View
          style={[
            styles.imageArea,
            {
              opacity: fadeAnim,
              transform: [{ translateY: floatAnim }, { scale: scalePop }],
            },
          ]}
        >
          {/* Pulsing ring */}
          <Animated.View
            style={[
              styles.glowRing,
              {
                opacity: ringOpacity,
                transform: [{ scale: ringScale }],
              },
            ]}
          />
          <Image
            source={require("../assets/poses/sukhasana.png")}
            style={styles.poseImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Message */}
        <Animated.Text style={[styles.message, { opacity: textFade }]}>
          You gave your students a beautiful practice.
        </Animated.Text>

        {/* Return CTA */}
        <Animated.View style={{ opacity: btnFade }}>
          <Pressable
            style={styles.cta}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.ctaText}>RETURN HOME</Text>
          </Pressable>
        </Animated.View>
      </View>
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

  // Icon + ring
  imageArea: {
    width: 180,
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 56,
  },
  glowRing: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1.5,
    borderColor: "#43B1E8",
  },
  poseImage: {
    width: 120,
    height: 120,
  },

  // Message — Cormorant Garamond Italic
  message: {
    color: "#7999C1",
    fontSize: 20,
    fontFamily: "CormorantGaramond-Italic",
    textAlign: "center",
    lineHeight: 32,
    marginBottom: 64,
    maxWidth: 280,
  },

  // CTA
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
