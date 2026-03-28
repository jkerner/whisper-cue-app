import { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ImageSourcePropType,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pose, Sequence, SequenceStep } from "../src/types";
import sequencesData from "../src/data/sequences.json";
import posesData from "../src/data/poses.json";

const sequences = sequencesData as Sequence[];
const poses = posesData as Pose[];
const sequence = sequences[0];

function getPose(poseId: string): Pose | undefined {
  return poses.find((p) => p.id === poseId);
}

// Map section names to pose icon images
const sectionImages: Record<string, ImageSourcePropType> = {
  "Integration": require("../assets/poses/sukhasana.png"),
  "Warm-Up": require("../assets/poses/balasana.png"),
  "Sun A": require("../assets/poses/tadasana.png"),
  "Sun B": require("../assets/poses/utkatasana.png"),
  "Chair Twists + Fold Series": require("../assets/poses/parivrtta-utkatasana.png"),
  "Sun B+": require("../assets/poses/knee-to-nose.png"),
  "Balance Series": require("../assets/poses/garudasana.png"),
  "Standing Peak Series": require("../assets/poses/parsvottanasana.png"),
  "Backbends": require("../assets/poses/dhanurasana.png"),
  "Seated Folds": require("../assets/poses/paschimottanasana.png"),
  "Hip Openers + Bridge": require("../assets/poses/urdhva-dhanurasana.png"),
  "Cooling Shapes": require("../assets/poses/constructive-rest.png"),
  "Savasana + Close": require("../assets/poses/savasana.png"),
};

// Per-section icon size overrides (default 50)
const sectionIconSizes: Record<string, number> = {
  "Backbends": 42,
  "Hip Openers + Bridge": 54,
};

// Group steps by section, dedup consecutive poses within each section
interface SectionGroup {
  section: string;
  poses: { pose: Pose; count: number; stepIndex: number }[];
  stepCount: number;
  firstStepIndex: number;
}

function getSections(steps: SequenceStep[]): SectionGroup[] {
  const sections: SectionGroup[] = [];
  let currentSection = "";
  let currentPoses: { pose: Pose; count: number; stepIndex: number }[] = [];
  let prevPoseId = "";
  let firstStepIndex = 0;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const section = (step as any).section || "Untitled";
    const pose = getPose(step.poseId);
    if (!pose) continue;

    if (section !== currentSection) {
      if (currentSection) {
        sections.push({
          section: currentSection,
          poses: currentPoses,
          stepCount: steps.filter((s) => (s as any).section === currentSection)
            .length,
          firstStepIndex,
        });
      }
      currentSection = section;
      currentPoses = [{ pose, count: 1, stepIndex: i }];
      prevPoseId = pose.id;
      firstStepIndex = i;
    } else if (pose.id === prevPoseId) {
      currentPoses[currentPoses.length - 1].count++;
    } else {
      currentPoses.push({ pose, count: 1, stepIndex: i });
      prevPoseId = pose.id;
    }
  }

  if (currentSection) {
    sections.push({
      section: currentSection,
      poses: currentPoses,
      stepCount: steps.filter((s) => (s as any).section === currentSection)
        .length,
      firstStepIndex,
    });
  }

  return sections;
}

const sections = getSections(sequence.steps);

function SectionCard({ group, index, onStartAt }: { group: SectionGroup; index: number; onStartAt: (stepIndex: number) => void }) {
  const [expanded, setExpanded] = useState(false);
  const sectionImage = sectionImages[group.section];
  const iconSize = sectionIconSizes[group.section] || 50;

  return (
    <View style={sStyles.card}>
      <Pressable style={sStyles.cardHeader} onPress={() => setExpanded(!expanded)}>
        <View style={sStyles.iconWrap}>
          {sectionImage ? (
            <Image source={sectionImage} style={{ width: iconSize, height: iconSize }} resizeMode="contain" />
          ) : (
            <Feather name="circle" size={16} color="#43B1E8" />
          )}
        </View>
        <View style={sStyles.cardLeft}>
          <Text style={sStyles.sectionName}>{group.section.toUpperCase()}</Text>
          <Text style={sStyles.sectionMeta}>
            {group.poses.length} POSE{group.poses.length !== 1 ? "S" : ""} · {group.stepCount} CUE{group.stepCount !== 1 ? "S" : ""}
          </Text>
        </View>
        <Feather
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#43B1E8"
        />
      </Pressable>

      {expanded && (
        <View style={sStyles.poseList}>
          {group.poses.map((item, i) => (
            <Pressable
              key={`${item.pose.id}-${i}`}
              style={sStyles.poseRow}
              onPress={() => onStartAt(item.stepIndex)}
            >
              <View style={sStyles.poseDot} />
              <View style={sStyles.poseInfo}>
                <Text style={sStyles.poseName}>{item.pose.englishName}</Text>
                {item.pose.sanskritName && (
                  <Text style={sStyles.poseSanskrit}>
                    {item.pose.sanskritName.toUpperCase()}
                  </Text>
                )}
              </View>
              <Feather name="play" size={12} color="#7999C1" style={{ opacity: 0.4 }} />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const sStyles = StyleSheet.create({
  card: {
    backgroundColor: "#0d1117",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#0B1119",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  cardLeft: {
    flex: 1,
    gap: 4,
  },
  sectionName: {
    color: "#F8F9FA",
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 2,
  },
  sectionMeta: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 2,
  },
  poseList: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingLeft: 60,
    gap: 10,
  },
  poseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  poseDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#1a2230",
  },
  poseInfo: {
    flex: 1,
  },
  poseName: {
    color: "#F8F9FA",
    fontSize: 14,
    opacity: 0.8,
  },
  poseSanskrit: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 2,
  },
});

export default function SequenceScreen() {
  const router = useRouter();
  const totalPoses = new Set(sequence.steps.map((s) => s.poseId)).size;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}>
            <Feather name="arrow-left" size={20} color="#43B1E8" />
          </Pressable>
        </View>

        {/* Title area */}
        <View style={styles.titleArea}>
          <Text style={styles.eyebrow}>SEQUENCE</Text>
          <Text style={styles.title}>Power Vinyasa — 60 Min</Text>
          <Text style={styles.titleSub}>Root & Rise</Text>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{sequence.steps.length}</Text>
              <Text style={styles.metaLabel}>CUES</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{totalPoses}</Text>
              <Text style={styles.metaLabel}>POSES</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{sections.length}</Text>
              <Text style={styles.metaLabel}>SECTIONS</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>~60</Text>
              <Text style={styles.metaLabel}>MINUTES</Text>
            </View>
          </View>
        </View>

        {/* Sections */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((group, i) => (
            <SectionCard
              key={`${group.section}-${i}`}
              group={group}
              index={i}
              onStartAt={(stepIndex) =>
                router.push({
                  pathname: "/live-teach",
                  params: { startIndex: stepIndex.toString() },
                })
              }
            />
          ))}
        </ScrollView>

        {/* Begin Class CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={styles.cta}
            onPress={() => router.push("/live-teach")}
          >
            <Text style={styles.ctaText}>BEGIN CLASS</Text>
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  titleArea: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  eyebrow: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 3.5,
    marginBottom: 8,
  },
  title: {
    color: "#F8F9FA",
    fontSize: 26,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  titleSub: {
    color: "#7999C1",
    fontSize: 18,
    fontFamily: "CormorantGaramond-Italic",
    fontVariant: ["lining-nums"],
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  metaItem: {
    alignItems: "center",
    gap: 2,
  },
  metaValue: {
    color: "#F8F9FA",
    fontSize: 20,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
  },
  metaLabel: {
    color: "#7999C1",
    fontSize: 8,
    letterSpacing: 2,
  },
  metaDivider: {
    width: 1,
    height: 24,
    backgroundColor: "#1a2230",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
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
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 3,
  },
});
