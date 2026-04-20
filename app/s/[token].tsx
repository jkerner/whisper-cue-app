import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../../src/lib/supabase";

interface SharedSequence {
  name: string;
  description: string | null;
  sections: { name: string; poses: { title: string }[] }[];
}

export default function SharedSequenceScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const router = useRouter();
  const [sequence, setSequence] = useState<SharedSequence | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    supabase
      .from("sequences")
      .select("name, description, sections")
      .eq("share_token", token)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); }
        else { setSequence(data as SharedSequence); }
        setLoading(false);
      });
  }, [token]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color="#43B1E8" style={{ marginTop: 80 }} />
        ) : notFound ? (
          <View style={styles.center}>
            <Text style={styles.notFoundTitle}>Sequence not found</Text>
            <Text style={styles.notFoundSub}>This link may have expired or been removed.</Text>
          </View>
        ) : sequence ? (
          <>
            <Text style={styles.eyebrow}>SHARED SEQUENCE</Text>
            <Text style={styles.title}>{sequence.name}</Text>
            {sequence.description ? (
              <Text style={styles.subtitle}>{sequence.description}</Text>
            ) : null}

            <View style={styles.sections}>
              {(sequence.sections || []).map((section, i) => (
                <View key={i} style={styles.sectionCard}>
                  <Text style={styles.sectionName}>{section.name}</Text>
                  {(section.poses || []).length > 0 && (
                    <Text style={styles.sectionPoses}>
                      {section.poses.map((p) => p.title).join(" · ")}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            <Pressable style={styles.cta} onPress={() => router.replace("/auth")}>
              <Text style={styles.ctaText}>BUILD YOUR OWN SEQUENCE</Text>
              <Feather name="arrow-right" size={14} color="#030303" />
            </Pressable>
            <Text style={styles.ctaSub}>Join WhisperCue — free for yoga teachers</Text>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },
  content: { paddingHorizontal: 24, paddingTop: 48, paddingBottom: 48 },

  eyebrow: { color: "#43B1E8", fontSize: 9, letterSpacing: 3.5, fontWeight: "600", marginBottom: 12 },
  title: {
    color: "#F8F9FA",
    fontSize: 36,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    color: "#7999C1",
    fontSize: 16,
    fontFamily: "CormorantGaramond-Italic",
    marginBottom: 32,
    lineHeight: 24,
  },

  sections: { gap: 10, marginBottom: 48 },
  sectionCard: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#1a2230",
    padding: 18,
  },
  sectionName: {
    color: "#F8F9FA",
    fontSize: 15,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    marginBottom: 6,
  },
  sectionPoses: {
    color: "#7999C1",
    fontSize: 12,
    lineHeight: 18,
  },

  cta: {
    backgroundColor: "#43B1E8",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },
  ctaText: { color: "#030303", fontSize: 13, fontWeight: "700", letterSpacing: 3 },
  ctaSub: { color: "#7999C1", fontSize: 12, textAlign: "center", fontFamily: "CormorantGaramond-Italic" },

  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 120 },
  notFoundTitle: { color: "#F8F9FA", fontSize: 20, fontFamily: "CircularStd-Bold", fontWeight: "normal", marginBottom: 8 },
  notFoundSub: { color: "#7999C1", fontSize: 14, fontFamily: "CormorantGaramond-Italic", textAlign: "center" },
});
