import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";

interface SavedSequence {
  id: string;
  name: string;
  description: string | null;
  estimated_minutes: number | null;
  sections: any[];
  created_at: string;
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState<string | null>(null);
  const [sequences, setSequences] = useState<SavedSequence[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const name = user.user_metadata?.full_name?.split(" ")[0]
        || user.user_metadata?.name?.split(" ")[0]
        || null;
      setUserName(name);

      const { data } = await supabase
        .from("sequences")
        .select("id, name, description, estimated_minutes, sections, created_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      setSequences(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const totalPoses = (seq: SavedSequence) =>
    (seq.sections || []).reduce((sum: number, s: any) => sum + (s.poses?.length || 0), 0);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting()}{userName ? `, ${userName}` : ""}</Text>
            <Text style={styles.headerSub}>WHISPER CUE</Text>
          </View>
          <Pressable style={styles.accountBtn} onPress={() => router.push("/account")}>
            <Feather name="user" size={18} color="#7999C1" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>YOUR SEQUENCES</Text>

          {loading ? (
            <ActivityIndicator color="#43B1E8" style={{ marginTop: 40 }} />
          ) : sequences.length === 0 ? (
            <View style={styles.emptyState}>
              <Image
                source={require("../assets/poses/whisper-cue.png")}
                style={styles.emptyIcon}
                resizeMode="contain"
              />
              <Text style={styles.emptyTitle}>No sequences yet</Text>
              <Text style={styles.emptyDesc}>
                Build your first class flow and it will live here.
              </Text>
            </View>
          ) : (
            <View style={styles.sequenceList}>
              {sequences.map((seq) => {
                const poseCount = totalPoses(seq);
                const sectionCount = (seq.sections || []).length;
                return (
                  <Pressable
                    key={seq.id}
                    style={styles.card}
                    onPress={() => router.push("/sequence")}
                  >
                    <View style={styles.cardTop}>
                      <View style={styles.cardMeta}>
                        {seq.estimated_minutes ? (
                          <Text style={styles.cardDuration}>{seq.estimated_minutes} MIN</Text>
                        ) : null}
                        <Text style={styles.cardStat}>{sectionCount} SECTIONS</Text>
                        {poseCount > 0 && (
                          <Text style={styles.cardStat}>{poseCount} POSES</Text>
                        )}
                      </View>
                      <Feather name="play-circle" size={20} color="#43B1E8" />
                    </View>
                    <Text style={styles.cardName}>{seq.name}</Text>
                    {seq.description ? (
                      <Text style={styles.cardDesc}>{seq.description}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Build CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.cta}
            onPress={() => router.push("/builder-entry")}
          >
            <Feather name="plus" size={16} color="#030303" />
            <Text style={styles.ctaText}>BUILD A SEQUENCE</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  greeting: {
    color: "#F8F9FA",
    fontSize: 24,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  headerSub: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "600",
  },
  accountBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0d1117",
    borderWidth: 1,
    borderColor: "#1a2230",
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 24 },

  sectionLabel: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "600",
    marginBottom: 16,
  },

  emptyState: {
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 32,
    gap: 12,
  },
  emptyIcon: {
    width: 120,
    height: 120,
    opacity: 0.4,
    marginBottom: 8,
  },
  emptyTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  emptyDesc: {
    color: "#7999C1",
    fontSize: 14,
    fontFamily: "CormorantGaramond-Italic",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 24,
  },

  sequenceList: { gap: 12 },
  card: {
    backgroundColor: "#0d1117",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1a2230",
    padding: 20,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  cardMeta: { flexDirection: "row", gap: 12, alignItems: "center" },
  cardDuration: {
    color: "#F8F9FA",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardStat: {
    color: "#7999C1",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 2,
  },
  cardName: {
    color: "#F8F9FA",
    fontSize: 22,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  cardDesc: {
    color: "#7999C1",
    fontSize: 14,
    fontFamily: "CormorantGaramond-Italic",
  },

  ctaContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  cta: {
    backgroundColor: "#43B1E8",
    borderRadius: 20,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  ctaText: {
    color: "#030303",
    fontSize: 13,
    fontWeight: "700",
    letterSpacing: 3,
  },
});
