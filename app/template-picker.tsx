import { View, Text, Pressable, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore, makeId, poseToSequencePose } from "../src/lib/builder-store";
import posesData from "../src/data/poses.json";

const poseById: Record<string, any> = {};
for (const p of posesData as any[]) poseById[p.id] = p;

interface Template {
  id: string;
  name: string;
  subtitle: string;
  duration: string;
  level: string;
  sections: string[];
  sectionPoses?: Record<string, string[]>;
}

const TEMPLATES: Template[] = [
  {
    id: "vinyasa-flow-60",
    name: "Vinyasa Flow",
    subtitle: "Build heat, rise to a peak, find your way home",
    duration: "60 MIN",
    level: "ALL LEVELS",
    sections: ["Set the Tone + Grounding", "Warm-Up", "Sun Salutations", "Rise to the Peak", "Peak Poses", "Wind Down", "Savasana + Close"],
    sectionPoses: {
      "Set the Tone + Grounding": ["easy-pose", "pranayama-4-7", "seated-cat-cow-pose", "meditation"],
      "Warm-Up": ["child-pose", "cat-cow-pose", "table-top-pose", "thread-the-needle-pose", "downward-facing-dog-pose"],
      "Sun Salutations": ["sun-salutation-a", "sun-salutation-b"],
      "Rise to the Peak": ["warrior-pose-i", "warrior-pose-ii", "reverse-warrior-pose", "extended-side-angle-pose", "triangle-pose", "high-lunge-pose"],
      "Peak Poses": ["half-moon-pose", "dancer-pose"],
      "Wind Down": ["half-pigeon-pose", "seated-forward-bend-pose", "supine-spinal-twist-pose", "bridge-pose", "happy-baby-pose"],
      "Savasana + Close": ["corpse-pose", "closing"],
    },
  },
  {
    id: "power-vinyasa-90",
    name: "Power Vinyasa",
    subtitle: "More time to build, explore, and land softly",
    duration: "90 MIN",
    level: "INTERMEDIATE",
    sections: ["Set the Tone + Grounding", "Warm-Up", "Sun Salutations A", "Sun Salutations B", "Rise to the Peak", "Peak Poses", "Hip Openers", "Backbends", "Wind Down", "Savasana + Close"],
  },
  {
    id: "yin-75",
    name: "Yin Yoga",
    subtitle: "Long holds, deep tissue, quiet mind",
    duration: "75 MIN",
    level: "ALL LEVELS",
    sections: ["Arrival + Centering", "Hip Openers", "Spinal Sequence", "Forward Folds", "Restorative Close", "Savasana"],
  },
  {
    id: "beginner-45",
    name: "Beginner Flow",
    subtitle: "Build a strong foundation, breath by breath",
    duration: "45 MIN",
    level: "BEGINNER",
    sections: ["Welcome + Grounding", "Gentle Warm-Up", "Standing Poses", "Floor Work", "Savasana"],
  },
  {
    id: "restorative-60",
    name: "Restorative",
    subtitle: "Supported shapes, parasympathetic rest, full release",
    duration: "60 MIN",
    level: "ALL LEVELS",
    sections: ["Arrival", "Supported Hip Openers", "Supported Backbend", "Supported Twist", "Legs Up the Wall", "Savasana + Close"],
  },
  {
    id: "meditation-30",
    name: "Meditation + Pranayama",
    subtitle: "Breathwork and seated practice",
    duration: "30 MIN",
    level: "ALL LEVELS",
    sections: ["Centering", "Pranayama", "Guided Meditation", "Dedication + Close"],
  },
];

const LEVEL_COLORS: Record<string, string> = {
  "ALL LEVELS": "#43B1E8",
  "BEGINNER": "#7DCFA8",
  "INTERMEDIATE": "#AAA8D6",
  "ADVANCED": "#E88C43",
};

export default function TemplatePickerScreen() {
  const router = useRouter();

  const handleSelectTemplate = (template: Template) => {
    const sections = template.sections.map((name) => {
      const poseIds = template.sectionPoses?.[name] ?? [];
      const poses = poseIds
        .map((id, idx) => poseById[id] ? poseToSequencePose(poseById[id], idx) : null)
        .filter((p): p is NonNullable<typeof p> => p !== null);
      return { id: makeId(), name, poses };
    });
    builderStore.setSections(sections);
    router.push({
      pathname: "/builder",
      params: {
        sequenceName: template.name,
        sequenceSubtitle: template.subtitle,
      },
    });
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Feather name="arrow-left" size={20} color="#43B1E8" />
        </Pressable>
      </View>

      <View style={styles.titleArea}>
        <Text style={styles.eyebrow}>TEMPLATES</Text>
        <Text style={styles.title}>Choose a{"\n"}starting point</Text>
        <Text style={styles.subtitle}>Pick a format and make it yours.</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {TEMPLATES.map((template) => (
          <Pressable
            key={template.id}
            style={styles.card}
            onPress={() => handleSelectTemplate(template)}
          >
            <View style={styles.cardTop}>
              <View style={styles.cardMeta}>
                <Text style={styles.duration}>{template.duration}</Text>
                <Text style={[styles.level, { color: LEVEL_COLORS[template.level] || "#43B1E8" }]}>
                  {template.level}
                </Text>
                {template.sectionPoses && (
                  <View style={styles.filledBadge}>
                    <Text style={styles.filledBadgeText}>PRE-FILLED</Text>
                  </View>
                )}
              </View>
              <Feather name="chevron-right" size={16} color="#7999C1" />
            </View>

            <Text style={styles.cardName}>{template.name}</Text>
            <Text style={styles.cardSubtitle}>{template.subtitle}</Text>

            <View style={styles.sectionChips}>
              {template.sections.slice(0, 4).map((s, i) => (
                <View key={i} style={styles.chip}>
                  <Text style={styles.chipText}>{s}</Text>
                </View>
              ))}
              {template.sections.length > 4 && (
                <View style={styles.chip}>
                  <Text style={styles.chipText}>+{template.sections.length - 4} more</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
  backButton: { width: 36 },
  titleArea: { paddingHorizontal: 24, paddingBottom: 24 },
  eyebrow: { color: "#43B1E8", fontSize: 9, letterSpacing: 3.5, marginBottom: 12 },
  title: {
    color: "#F8F9FA",
    fontSize: 32,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 8,
  },
  subtitle: {
    color: "#7999C1",
    fontSize: 15,
    fontFamily: "CormorantGaramond-Italic",
  },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, gap: 12 },

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
  duration: {
    color: "#F8F9FA",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2,
  },
  level: {
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
  cardSubtitle: {
    color: "#7999C1",
    fontSize: 14,
    fontFamily: "CormorantGaramond-Italic",
    marginBottom: 16,
  },
  sectionChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  chip: {
    backgroundColor: "#131820",
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#1e2a38",
  },
  chipText: { color: "#7999C1", fontSize: 11, letterSpacing: 0.5 },
  filledBadge: {
    backgroundColor: "#0d2a1a",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#7DCFA8",
    paddingVertical: 2,
    paddingHorizontal: 7,
  },
  filledBadgeText: { color: "#7DCFA8", fontSize: 8, fontWeight: "700", letterSpacing: 1.5 },
});
