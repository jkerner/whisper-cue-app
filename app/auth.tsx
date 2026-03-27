import { useState } from "react";
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
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";

type Step = "choose" | "email" | "password";

export default function AuthScreen() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("choose");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Step 1: Choose method
  if (step === "choose") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <Image
            source={require("../assets/poses/whisper-cue.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.heading}>Welcome</Text>
          <Text style={styles.subtext}>BEGIN YOUR TEACHING PRACTICE</Text>

          <View style={styles.bottom}>
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
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // Step 2: Email
  if (step === "email") {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
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
      <View style={styles.container}>
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
  container: {
    flex: 1,
    padding: 32,
    paddingTop: 80,
  },
  back: {
    marginBottom: 24,
  },
  logo: {
    width: 80,
    height: 80,
    alignSelf: "center",
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
  bottom: {
    position: "absolute",
    bottom: 48,
    left: 32,
    right: 32,
    gap: 16,
  },
  googleBtn: {
    backgroundColor: "#F8F9FA",
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
