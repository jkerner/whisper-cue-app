import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore } from "../src/lib/builder-store";

export default function BuilderEntryScreen() {
  const router = useRouter();

  const handleStartFromScratch = () => {
    builderStore.reset();
    router.push("/builder");
  };

  const handleUseExisting = () => {
    // TODO: navigate to sequence picker once persistence is wired up
  };

  const handleUseTemplate = () => {
    // TODO: navigate to template picker
    // For now, route to builder with defaults as a placeholder
    builderStore.reset();
    router.push("/builder");
  };

  // No saved sequences yet — disable "Use Existing Sequence"
  const hasExistingSequences = false;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#43B1E8" />
          </Pressable>
        </View>

        {/* Title area */}
        <View style={styles.titleArea}>
          <Text style={styles.eyebrow}>SEQUENCE BUILDER</Text>
          <Text style={styles.title}>How do you want{"\n"}to start?</Text>
          <Text style={styles.subtitle}>
            Build a class flow from scratch, pick up where you left off, or
            start from a template.
          </Text>
        </View>

        {/* Options */}
        <View style={styles.options}>
          {/* Start from Scratch */}
          <Pressable style={styles.optionCard} onPress={handleStartFromScratch}>
            <View style={styles.optionIcon}>
              <Feather name="edit-3" size={22} color="#43B1E8" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Start from Scratch</Text>
              <Text style={styles.optionDesc}>
                Build a new sequence with default sections
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#1a2230" />
          </Pressable>

          {/* Use Template */}
          <Pressable style={styles.optionCard} onPress={handleUseTemplate}>
            <View style={styles.optionIcon}>
              <Feather name="copy" size={22} color="#43B1E8" />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>Use a Template</Text>
              <Text style={styles.optionDesc}>
                Start from a proven class flow and make it yours
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#1a2230" />
          </Pressable>

          {/* Use Existing Sequence */}
          <Pressable
            style={[
              styles.optionCard,
              !hasExistingSequences && styles.optionCardDisabled,
            ]}
            onPress={handleUseExisting}
            disabled={!hasExistingSequences}
          >
            <View
              style={[
                styles.optionIcon,
                !hasExistingSequences && styles.optionIconDisabled,
              ]}
            >
              <Feather
                name="layers"
                size={22}
                color={hasExistingSequences ? "#43B1E8" : "#1a2230"}
              />
            </View>
            <View style={styles.optionText}>
              <Text
                style={[
                  styles.optionTitle,
                  !hasExistingSequences && styles.optionTitleDisabled,
                ]}
              >
                Adapt Existing Sequence
              </Text>
              <Text
                style={[
                  styles.optionDesc,
                  !hasExistingSequences && styles.optionDescDisabled,
                ]}
              >
                {hasExistingSequences
                  ? "Edit one of your saved sequences"
                  : "No saved sequences yet"}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={hasExistingSequences ? "#1a2230" : "#0d1117"}
            />
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
  backButton: {
    width: 36,
  },
  titleArea: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  eyebrow: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 3.5,
    marginBottom: 12,
  },
  title: {
    color: "#F8F9FA",
    fontSize: 28,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    lineHeight: 36,
    marginBottom: 12,
  },
  subtitle: {
    color: "#7999C1",
    fontSize: 15,
    fontFamily: "CormorantGaramond-Italic",
    lineHeight: 22,
  },
  options: {
    paddingHorizontal: 24,
    gap: 12,
  },
  optionCard: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  optionCardDisabled: {
    opacity: 0.4,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#131820",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconDisabled: {
    backgroundColor: "#0d1117",
  },
  optionText: {
    flex: 1,
    gap: 4,
  },
  optionTitle: {
    color: "#F8F9FA",
    fontSize: 16,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  optionTitleDisabled: {
    color: "#7999C1",
  },
  optionDesc: {
    color: "#7999C1",
    fontSize: 13,
    lineHeight: 18,
  },
  optionDescDisabled: {
    color: "#1a2230",
  },
});
