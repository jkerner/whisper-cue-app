import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";

export default function AccountScreen() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      setEmail(user.email || null);
      setName(
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        null
      );
    });
  }, []);

  const handleSignOut = async () => {
    Alert.alert("Sign out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await supabase.auth.signOut();
          router.replace("/auth");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#43B1E8" />
          </Pressable>
        </View>

        <View style={styles.titleArea}>
          <Text style={styles.eyebrow}>ACCOUNT</Text>
          <Text style={styles.title}>{name || "Your Account"}</Text>
          {email ? <Text style={styles.email}>{email}</Text> : null}
        </View>

        <View style={styles.section}>
          {/* Billing placeholder */}
          <View style={styles.row}>
            <View style={styles.rowIcon}>
              <Feather name="credit-card" size={18} color="#7999C1" />
            </View>
            <View style={styles.rowText}>
              <Text style={styles.rowTitle}>Billing</Text>
              <Text style={styles.rowDesc}>Coming soon</Text>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.signOutBtn} onPress={handleSignOut}>
            <Feather name="log-out" size={16} color="#7999C1" />
            <Text style={styles.signOutText}>SIGN OUT</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backButton: { width: 36 },
  titleArea: { paddingHorizontal: 24, paddingBottom: 40 },
  eyebrow: { color: "#43B1E8", fontSize: 9, letterSpacing: 3.5, marginBottom: 12 },
  title: {
    color: "#F8F9FA",
    fontSize: 32,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  email: { color: "#7999C1", fontSize: 14, letterSpacing: 0.3 },
  section: { paddingHorizontal: 24 },
  row: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a2230",
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    gap: 14,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#131820",
    alignItems: "center",
    justifyContent: "center",
  },
  rowText: { flex: 1 },
  rowTitle: {
    color: "#F8F9FA",
    fontSize: 15,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    marginBottom: 2,
  },
  rowDesc: { color: "#7999C1", fontSize: 12 },
  footer: {
    position: "absolute",
    bottom: 40,
    left: 24,
    right: 24,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  signOutText: {
    color: "#7999C1",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
  },
});
