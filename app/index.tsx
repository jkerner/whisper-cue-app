import { useEffect, useRef, useState } from "react";
import { Share } from "react-native";
import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { supabase } from "../src/lib/supabase";
import { builderStore, makeId, poseToSequencePose } from "../src/lib/builder-store";
import posesData from "../src/data/poses.json";

const poseById: Record<string, any> = {};
for (const p of posesData as any[]) poseById[p.id] = p;

const VINYASA_FLOW_SECTIONS: Record<string, string[]> = {
  "Set the Tone + Grounding": ["easy-pose", "pranayama-4-7", "seated-cat-cow-pose", "meditation"],
  "Warm-Up": ["child-pose", "cat-cow-pose", "table-top-pose", "thread-the-needle-pose", "downward-facing-dog-pose"],
  "Sun Salutations": ["sun-salutation-a", "sun-salutation-b"],
  "Rise to the Peak": ["warrior-pose-i", "warrior-pose-ii", "reverse-warrior-pose", "extended-side-angle-pose", "triangle-pose", "high-lunge-pose"],
  "Peak Poses": ["half-moon-pose", "dancer-pose"],
  "Wind Down": ["half-pigeon-pose", "seated-forward-bend-pose", "supine-spinal-twist-pose", "bridge-pose", "happy-baby-pose"],
  "Savasana + Close": ["corpse-pose", "closing"],
};

interface SavedSequence {
  id: string;
  name: string;
  description: string | null;
  estimated_minutes: number | null;
  sections: any[];
  created_at: string;
}

const TITLE = "Whisper Cue";
const LETTER_DELAY = 80;
const RING_SIZE = 180;

function SunbeamRay({ angle, delay }: { angle: number; delay: number }) {
  const rayFade = useRef(new Animated.Value(0)).current;
  const rayShoot = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(rayFade, { toValue: 0.25, duration: 1500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
          Animated.timing(rayShoot, { toValue: -12, duration: 1500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(rayFade, { toValue: 0, duration: 1500, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
          Animated.timing(rayShoot, { toValue: 0, duration: 1500, useNativeDriver: true }),
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

export default function HomeScreen() {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(0);
  const [sequences, setSequences] = useState<SavedSequence[]>([]);
  const [loading, setLoading] = useState(true);

  const logoFade = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const wordmarkFade = useRef(new Animated.Value(0)).current;
  const wordmarkPulse = useRef(new Animated.Value(1)).current;
  const subtitleFade = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentSlide = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Load sequences
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase
        .from("sequences")
        .select("id, name, description, estimated_minutes, sections, created_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false })
        .then(({ data }) => { setSequences(data || []); setLoading(false); });
    });

    // Animations
    Animated.sequence([
      Animated.delay(300),
      Animated.timing(logoFade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.06, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    const startDelay = 900;
    for (let i = 0; i <= TITLE.length; i++) {
      setTimeout(() => setVisibleCount(i), startDelay + i * LETTER_DELAY);
    }

    Animated.sequence([
      Animated.delay(900),
      Animated.timing(wordmarkFade, { toValue: 1, duration: 800, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();

    Animated.sequence([
      Animated.delay(1400),
      Animated.timing(subtitleFade, { toValue: 1, duration: 600, useNativeDriver: true }),
    ]).start();

    const lettersFinishAt = 900 + TITLE.length * LETTER_DELAY + 200;
    setTimeout(() => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(wordmarkPulse, { toValue: 1.04, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
          Animated.timing(wordmarkPulse, { toValue: 1, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        ])
      ).start();
    }, lettersFinishAt);

    Animated.sequence([
      Animated.delay(1800),
      Animated.parallel([
        Animated.timing(contentFade, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(contentSlide, { toValue: 0, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleDelete = async (seq: SavedSequence) => {
    Alert.alert(
      "Delete sequence",
      `Delete "${seq.name}"? This can't be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase.from("sequences").delete().eq("id", seq.id);
            if (error) {
              Alert.alert("Couldn't delete", error.message);
            } else {
              setSequences((prev) => prev.filter((s) => s.id !== seq.id));
            }
          },
        },
      ]
    );
  };

  const handleShare = async (seq: SavedSequence) => {
    let token = (seq as any).share_token as string | null;
    if (!token) {
      token = Math.random().toString(36).slice(2, 10);
      await supabase.from("sequences").update({ share_token: token }).eq("id", seq.id);
      setSequences((prev) => prev.map((s) => s.id === seq.id ? { ...s, share_token: token } as any : s));
    }
    Share.share({ message: `Check out my yoga sequence on WhisperCue: https://whispercue.app/s/${token}` });
  };

  const handleVinyasaFlow = () => {
    const sections = Object.entries(VINYASA_FLOW_SECTIONS).map(([name, poseIds]) => ({
      id: makeId(),
      name,
      poses: poseIds
        .map((id, idx) => poseById[id] ? poseToSequencePose(poseById[id], idx) : null)
        .filter((p): p is NonNullable<typeof p> => p !== null),
    }));
    builderStore.setSections(sections);
    router.push({
      pathname: "/builder",
      params: { sequenceName: "Vinyasa Flow", sequenceSubtitle: "Build heat, rise to a peak, find your way home" },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Account button */}
      <Pressable style={styles.accountBtn} onPress={() => router.push("/account")}>
        <Feather name="user" size={16} color="#7999C1" />
      </Pressable>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo + rays */}
        <View style={styles.logoArea}>
          {[...Array(9)].map((_, i) => (
            <SunbeamRay key={i} angle={-120 + i * 30} delay={i * 100} />
          ))}
          <Animated.View style={{ opacity: logoFade, transform: [{ scale: logoPulse }] }}>
            <Image
              source={require("../assets/poses/whisper-cue.png")}
              style={styles.logoIcon}
              resizeMode="contain"
            />
          </Animated.View>
        </View>

        {/* Title */}
        <Animated.View style={{ opacity: wordmarkFade, transform: [{ scale: wordmarkPulse }] }}>
          <Text style={styles.title}>
            {TITLE.split("").map((char, i) => (
              <Text key={i} style={{ opacity: i < visibleCount ? 1 : 0 }}>{char}</Text>
            ))}
          </Text>
        </Animated.View>

        {/* Subtitle */}
        <Animated.Text style={[styles.subtitle, { opacity: subtitleFade }]}>
          REAL-TIME CUEING FOR YOGA TEACHERS
        </Animated.Text>

        {/* Sequences */}
        <Animated.View style={[styles.sequencesWrap, { opacity: contentFade, transform: [{ translateY: contentSlide }] }]}>
          {/* Featured template */}
          <Text style={styles.sectionLabel}>START WITH A TEMPLATE</Text>
          <Pressable style={styles.card} onPress={handleVinyasaFlow}>
            <Text style={styles.cardEyebrow}>60 MIN · ALL LEVELS · PRE-FILLED</Text>
            <Text style={styles.cardTitle}>Vinyasa Flow</Text>
            <Text style={styles.cardSub}>Build heat, rise to a peak, find your way home</Text>
          </Pressable>

          {/* Saved sequences */}
          {loading ? (
            <ActivityIndicator color="#43B1E8" style={{ marginTop: 24 }} />
          ) : sequences.length > 0 ? (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 28 }]}>YOUR SEQUENCES</Text>
              {sequences.map((seq) => {
                return (
                  <Pressable
                    key={seq.id}
                    style={styles.card}
                    onPress={() => {
                      builderStore.setSections(seq.sections || []);
                      router.push({
                        pathname: "/builder",
                        params: {
                          sequenceId: seq.id,
                          sequenceName: seq.name,
                          sequenceSubtitle: seq.description || "",
                        },
                      });
                    }}
                  >
                    <View style={styles.cardRow}>
                      {seq.estimated_minutes ? (
                        <Text style={styles.cardEyebrow}>{seq.estimated_minutes} MIN</Text>
                      ) : null}
                      <View style={styles.cardActions}>
                        <Pressable onPress={(e) => { e.stopPropagation(); handleShare(seq); }} hitSlop={8}>
                          <Feather name="share" size={14} color="#7999C1" />
                        </Pressable>
                        <Pressable onPress={(e) => { e.stopPropagation(); handleDelete(seq); }} hitSlop={8}>
                          <Feather name="trash-2" size={14} color="#7999C1" />
                        </Pressable>
                      </View>
                    </View>
                    <Text style={styles.cardTitle}>{seq.name}</Text>
                    {seq.description ? (
                      <Text style={styles.cardSub}>{seq.description}</Text>
                    ) : null}
                  </Pressable>
                );
              })}
            </>
          ) : null}
        </Animated.View>
      </ScrollView>

      {/* CTA */}
      <Pressable style={styles.createButton} onPress={() => router.push("/builder-entry")}>
        <Feather name="plus" size={14} color="#43B1E8" />
        <Text style={styles.createText}>BUILD A SEQUENCE</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },

  accountBtn: {
    position: "absolute",
    top: 56,
    right: 24,
    zIndex: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0d1117",
    borderWidth: 1,
    borderColor: "#1a2230",
    alignItems: "center",
    justifyContent: "center",
  },

  scroll: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  logoArea: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: -16,
  },
  ray: {
    position: "absolute",
    width: 1,
    height: 24,
    backgroundColor: "#AAA8D6",
    borderRadius: 1,
  },
  logoIcon: { width: 130, height: 130 },

  title: {
    fontSize: 42,
    fontFamily: "DancingScript-Bold",
    fontWeight: "normal",
    color: "#F8F9FA",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 3,
    color: "#7999C1",
    marginBottom: 40,
  },

  sectionLabel: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "600",
    marginBottom: 14,
    alignSelf: "flex-start",
  },
  sequencesWrap: { width: "100%", gap: 10 },
  cardRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  cardActions: { flexDirection: "row", gap: 16, alignItems: "center" },
  sequenceList: { width: "100%", gap: 10 },
  card: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  cardEyebrow: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "500",
    marginBottom: 6,
  },
  cardTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  cardSub: {
    color: "#7999C1",
    fontSize: 14,
    fontFamily: "CormorantGaramond-Italic",
  },

  createButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 20,
    paddingHorizontal: 24,
  },
  createText: {
    color: "#43B1E8",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
  },
});
