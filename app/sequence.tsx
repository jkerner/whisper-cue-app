import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Pose, Sequence, SequenceStep } from "../src/types";
import sequencesData from "../src/data/sequences.json";
import posesData from "../src/data/poses.json";

const sequences = sequencesData as Sequence[];
const poses = posesData as Pose[];

// Grab the seeded sequence
const sequence = sequences[0];

function getPose(poseId: string): Pose | undefined {
  return poses.find((p) => p.id === poseId);
}

// Deduplicate consecutive repeated poses for the overview timeline
function getTimelineSteps(steps: SequenceStep[]) {
  const timeline: { pose: Pose; startIndex: number; count: number }[] = [];
  let prev = "";
  for (const step of steps) {
    const pose = getPose(step.poseId);
    if (!pose) continue;
    if (pose.id === prev) {
      timeline[timeline.length - 1].count++;
    } else {
      timeline.push({ pose, startIndex: step.orderIndex, count: 1 });
      prev = pose.id;
    }
  }
  return timeline;
}

const timeline = getTimelineSteps(sequence.steps);

export default function SequenceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Text style={styles.backText}>← Back</Text>
          </Pressable>
        </View>

        {/* Title area */}
        <View style={styles.titleArea}>
          <Text style={styles.eyebrow}>SEQUENCE</Text>
          <Text style={styles.title}>{sequence.name}</Text>
          <Text style={styles.meta}>
            {sequence.steps.length} cues · ~60 min
          </Text>
        </View>

        {/* Pose timeline */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {timeline.map((item, i) => (
            <View key={`${item.pose.id}-${i}`} style={styles.timelineRow}>
              {/* Timeline line + dot */}
              <View style={styles.timelineTrack}>
                <View
                  style={[
                    styles.timelineLine,
                    i === 0 && styles.timelineLineFirst,
                    i === timeline.length - 1 && styles.timelineLineLast,
                  ]}
                />
                <View style={styles.timelineDot} />
              </View>

              {/* Pose info */}
              <View style={styles.poseInfo}>
                <Text style={styles.poseName}>
                  {item.pose.englishName}
                </Text>
                {item.pose.sanskritName && (
                  <Text style={styles.poseSanskrit}>
                    {item.pose.sanskritName.toLowerCase()}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Begin Class CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.cta}
            onPress={() => router.push("/live-teach")}
          >
            <Text style={styles.ctaText}>Begin Class</Text>
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
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backText: {
    color: "#43B1E8",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  titleArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#7999C1",
    fontSize: 10,
    letterSpacing: 3.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    color: "#F8F9FA",
    fontSize: 28,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  meta: {
    color: "#7999C1",
    fontSize: 13,
    letterSpacing: 0.2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  timelineRow: {
    flexDirection: "row",
    minHeight: 56,
  },
  timelineTrack: {
    width: 32,
    alignItems: "center",
  },
  timelineLine: {
    position: "absolute",
    width: 2,
    top: 0,
    bottom: 0,
    backgroundColor: "#1a2230",
  },
  timelineLineFirst: {
    top: 12,
  },
  timelineLineLast: {
    bottom: 12,
  },
  timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#43B1E8",
    marginTop: 10,
  },
  poseInfo: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 20,
  },
  poseName: {
    color: "#F8F9FA",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  poseSanskrit: {
    color: "#43B1E8",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 2,
  },
  ctaContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    paddingTop: 12,
  },
  cta: {
    backgroundColor: "#43B1E8",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  ctaText: {
    color: "#030303",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
