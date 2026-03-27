import { useEffect, useRef, useState } from "react";
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

const TITLE = "Whisper Cue";
const LETTER_DELAY = 80;

function SunbeamRay({ angle, delay }: { angle: number; delay: number }) {
  const rayFade = useRef(new Animated.Value(0)).current;
  const rayShoot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(rayFade, {
            toValue: 0.25,
            duration: 1500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rayShoot, {
            toValue: -12,
            duration: 1500,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(rayFade, {
            toValue: 0,
            duration: 1500,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(rayShoot, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(1500 - delay),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.ray,
        {
          opacity: rayFade,
          transform: [
            { rotate: `${angle}deg` },
            { translateY: -90 },
            { translateY: rayShoot as any },
          ],
        },
      ]}
    />
  );
}

const RING_SIZE = 220;

export default function HomeScreen() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const logoFade = useRef(new Animated.Value(0)).current;
  const wordmarkFade = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const cardFade = useRef(new Animated.Value(0)).current;
  const cardSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // 1. Logo icon fades in
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Type out title letter by letter
    const startDelay = 900;
    for (let i = 0; i <= TITLE.length; i++) {
      setTimeout(() => setVisibleCount(i), startDelay + i * LETTER_DELAY);
    }

    // 3b. Wordmark fade (for container)
    Animated.sequence([
      Animated.delay(900),
      Animated.timing(wordmarkFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Subtitle
    Animated.sequence([
      Animated.delay(1400),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 5. Card slides up
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(cardFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cardSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo area with sunbeam rays */}
        <View style={styles.logoArea}>
          {/* Sunbeam rays — arcing from left up over top and down right */}
          {[...Array(13)].map((_, i) => (
            <SunbeamRay key={i} angle={-160 + i * 15} delay={i * 120} />
          ))}
          <Animated.View style={[styles.logoInner, { opacity: logoFade }]}>
            <Image
              source={require("../assets/poses/whisper-cue.png")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Title — letter by letter */}
        <Animated.View style={{ opacity: wordmarkFade }}>
          <Text style={styles.title}>
            {TITLE.split("").map((char, i) => (
              <Text key={i} style={{ opacity: i < visibleCount ? 1 : 0 }}>
                {char}
              </Text>
            ))}
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
          REAL-TIME CUEING FOR YOGA TEACHERS
        </Animated.Text>

        {/* Sequence card */}
        <Animated.View
          style={[
            styles.cardWrap,
            { opacity: cardFade, transform: [{ translateY: cardSlide }] },
          ]}
        >
          <Pressable
            style={styles.card}
            onPress={() => router.push("/sequence")}
          >
            <Text style={styles.cardEyebrow}>READY TO TEACH</Text>
            <Text style={styles.cardTitle}>
              Root & Rise — 60 Min Power Vinyasa
            </Text>
            <Text style={styles.cardMeta}>133 CUES · ~60 MIN</Text>
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
    padding: 24,
  },

  // Logo + ring
  logoArea: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -20,
  },
  ray: {
    position: "absolute",
    width: 1,
    height: 24,
    backgroundColor: "#AAA8D6",
    borderRadius: 1,
    borderStyle: "dashed",
  },
  logoInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoIcon: {
    width: 160,
    height: 160,
  },

  // Title
  title: {
    fontSize: 36,
    fontFamily: "CormorantGaramond-LightItalic",
    color: "#F8F9FA",
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 3,
    color: "#7999C1",
    marginBottom: 64,
  },
  cardWrap: {
    width: "100%",
  },
  card: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  cardEyebrow: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "500",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CormorantGaramond-Bold",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  cardMeta: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 2,
  },
});
