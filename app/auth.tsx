import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";

type Step = "choose" | "email" | "password";

const TITLE = "Whisper Cue";
const LETTER_DELAY = 80;
const RING_SIZE = 220;

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

export default function AuthScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Animations for choose step
  const [visibleCount, setVisibleCount] = useState(0);
  const logoFade = useRef(new Animated.Value(0)).current;
  const wordmarkFade = useRef(new Animated.Value(0)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const buttonsFade = useRef(new Animated.Value(0)).current;
  const buttonsSlide = useRef(new Animated.Value(20)).current;

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

    // 2. Type out title letter by letter
    const startDelay = 900;
    for (let i = 0; i <= TITLE.length; i++) {
      setTimeout(() => setVisibleCount(i), startDelay + i * LETTER_DELAY);
    }

    // 2b. Wordmark fade (for container)
    Animated.sequence([
      Animated.delay(900),
      Animated.timing(wordmarkFade, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // 3. Subtitle
    Animated.sequence([
      Animated.delay(1400),
      Animated.timing(subtitleFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    // 4. Buttons slide up
    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(buttonsFade, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsSlide, {
          toValue: 0,
          duration: 500,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const handleGoogleAuth = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });
    if (error) Alert.alert("Something shifted.", error.message);
  };

  const handleEmailContinue = () => {
    if (!email) {
      Alert.alert("Enter your email to continue.");
      return;
    }
    setStep("password");
  };

  const handleAuth = async () => {
    if (!password) {
      Alert.alert("Enter your password");
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        Alert.alert("Check your email", "We sent you a confirmation link.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.replace("/");
      }
    } catch (err: any) {
      Alert.alert("Something shifted.", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Choose method — branded hero with animations
  if (step === "choose") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.heroContainer}>
          {/* Logo area with sunbeam rays */}
          <View style={styles.logoArea}>
            {[...Array(9)].map((_, i) => (
              <SunbeamRay key={i} angle={-120 + i * 30} delay={i * 100} />
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

          {/* Auth buttons */}
          <Animated.View
            style={[
              styles.bottom,
              {
                opacity: buttonsFade,
                transform: [{ translateY: buttonsSlide }],
              },
            ]}
          >
            <Pressable style={styles.googleBtn} onPress={handleGoogleAuth}>
              <Text style={styles.googleText}>CONTINUE WITH GOOGLE</Text>
            </Pressable>

            <Pressable
              style={styles.emailBtn}
              onPress={() => {
                setIsSignUp(false);
                setStep("email");
              }}
            >
              <Text style={styles.emailText}>SIGN IN WITH EMAIL</Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setIsSignUp(true);
                setStep("email");
              }}
            >
              <Text style={styles.toggle}>NEW HERE? CREATE AN ACCOUNT</Text>
            </Pressable>
          </Animated.View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Email
  if (step === "email") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.formContainer}>
          <Pressable onPress={() => setStep("choose")} style={styles.back}>
            <Feather name="arrow-left" size={22} color="#7999C1" />
          </Pressable>

          <Text style={styles.heading}>Enter your email</Text>
          <Text style={styles.subtext}>
            {isSignUp ? "WE'LL CREATE YOUR ACCOUNT" : "WE'LL SIGN YOU IN"}
          </Text>

          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            placeholderTextColor="#7999C1"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoFocus
          />

          <View style={styles.bottom}>
            <Pressable style={styles.cta} onPress={handleEmailContinue}>
              <Text style={styles.ctaText}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 3: Password
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.formContainer}>
        <Pressable onPress={() => setStep("email")} style={styles.back}>
          <Feather name="arrow-left" size={22} color="#7999C1" />
        </Pressable>

        <Text style={styles.heading}>
          {isSignUp ? "Set your password" : "Enter your password"}
        </Text>
        <Text style={styles.subtext}>{email.toUpperCase()}</Text>

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          placeholderTextColor="#7999C1"
          secureTextEntry
          autoFocus
        />

        <View style={styles.bottom}>
          <Pressable
            style={styles.cta}
            onPress={handleAuth}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#030303" />
            ) : (
              <Text style={styles.ctaText}>
                {isSignUp ? "CREATE ACCOUNT" : "SIGN IN"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#030303",
  },

  // Step 1: branded hero layout (centered like home screen)
  heroContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
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

  // Steps 2 & 3: form layout
  formContainer: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
  },
  back: {
    marginBottom: 24,
  },
  heading: {
    color: "#F8F9FA",
    fontSize: 40,
    fontFamily: "CormorantGaramond-Bold",
    lineHeight: 48,
    marginBottom: 14,
  },
  subtext: {
    color: "#7999C1",
    fontSize: 11,
    letterSpacing: 3,
    marginBottom: 36,
  },
  input: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 22,
    color: "#F8F9FA",
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#1a2230",
  },

  // Shared bottom button area
  bottom: {
    position: "absolute",
    bottom: 48,
    left: 32,
    right: 32,
    gap: 16,
  },
  googleBtn: {
    backgroundColor: "#AAA8D6",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  googleText: {
    color: "#030303",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  emailBtn: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  emailText: {
    color: "#F8F9FA",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cta: {
    backgroundColor: "#AAA8D6",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
  },
  ctaText: {
    color: "#030303",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 3,
  },
  toggle: {
    color: "#7999C1",
    fontSize: 11,
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 4,
  },
});
