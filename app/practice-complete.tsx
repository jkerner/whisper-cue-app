import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function PracticeCompleteScreen() {
  const router = useRouter();
  const { elapsed } = useLocalSearchParams<{ elapsed: string }>();
  const totalSeconds = parseInt(elapsed || "0", 10);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Completion graphic area */}
        <View style={styles.glowArea}>
          <View style={styles.glowOuter}>
            <View style={styles.glowInner}>
              <Text style={styles.checkmark}>✦</Text>
            </View>
          </View>
        </View>

        {/* Display text */}
        <Text style={styles.title}>Practice Complete</Text>

        {/* Stats */}
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{formatTime(totalSeconds)}</Text>
            <Text style={styles.statLabel}>DURATION</Text>
          </View>
        </View>

        {/* Breathe easy cue */}
        <Text style={styles.breatheCue}>
          Let the breath return to its natural rhythm.{"\n"}You gave your
          students a beautiful practice.
        </Text>

        {/* Return CTA */}
        <Pressable
          style={styles.cta}
          onPress={() => router.replace("/")}
        >
          <Text style={styles.ctaText}>Return Home</Text>
        </Pressable>
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

  // Glow graphic
  glowArea: {
    marginBottom: 40,
  },
  glowOuter: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#43B1E8",
  },
  glowInner: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#131820",
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    color: "#43B1E8",
    fontSize: 32,
  },

  // Text
  title: {
    color: "#F8F9FA",
    fontSize: 36,
    fontWeight: "300",
    fontStyle: "italic",
    marginBottom: 32,
  },

  // Stats
  stats: {
    flexDirection: "row",
    marginBottom: 40,
  },
  statItem: {
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    color: "#43B1E8",
    fontSize: 40,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
  },
  statLabel: {
    color: "#7999C1",
    fontSize: 10,
    letterSpacing: 3,
  },

  // Breathe cue
  breatheCue: {
    color: "#7999C1",
    fontSize: 16,
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 26,
    marginBottom: 48,
    maxWidth: 320,
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
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
