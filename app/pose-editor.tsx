import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore, poseToSequencePose } from "../src/lib/builder-store";
import { Pose, SequencePose } from "../src/types";
import posesData from "../src/data/poses.json";

const allPoses = posesData as Pose[];

export default function PoseEditorScreen() {
  const router = useRouter();
  const { sectionId, poseId, sourcePoseId, mode } = useLocalSearchParams<{
    sectionId: string;
    poseId?: string;
    sourcePoseId?: string;
    mode?: "preview" | "edit";
  }>();

  const isPreview = mode === "preview" && !poseId;

  // For edit mode: read from the store
  // For preview mode: build a temporary SequencePose from the library pose
  const [pose, setPose] = useState<SequencePose | undefined>(() => {
    if (poseId) {
      return builderStore.getPose(sectionId!, poseId);
    }
    if (sourcePoseId) {
      const libraryPose = allPoses.find((p) => p.id === sourcePoseId);
      if (libraryPose) {
        return poseToSequencePose(libraryPose, 0);
      }
    }
    return undefined;
  });

  const [isAdded, setIsAdded] = useState(!isPreview);

  // In edit mode, subscribe to store changes
  useEffect(() => {
    if (!poseId) return;
    return builderStore.subscribe(() => {
      setPose(builderStore.getPose(sectionId!, poseId));
    });
  }, [sectionId, poseId]);

  // Local state for preview mode edits (not in store yet)
  const [localPose, setLocalPose] = useState<SequencePose | undefined>(pose);

  useEffect(() => {
    setLocalPose(pose);
  }, [pose?.id]);

  const currentPose = isAdded && poseId ? pose : localPose;

  const updateField = (field: keyof SequencePose, value: string) => {
    if (isAdded && poseId) {
      // Edit mode — write directly to store
      builderStore.updatePose(sectionId!, poseId, { [field]: value });
    } else {
      // Preview mode — update local state only
      setLocalPose((prev) => (prev ? { ...prev, [field]: value } : prev));
    }
  };

  const handleAddToSection = () => {
    if (!sectionId || !localPose) return;
    // Add the pose to the store
    builderStore.addCustomPoseToSection(sectionId, localPose);
    setIsAdded(true);
    router.back();
  };

  if (!currentPose) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#43B1E8" />
            </Pressable>
          </View>
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Pose not found</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const canSave = currentPose.title.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#43B1E8" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>
              {isPreview
                ? "PREVIEW POSE"
                : currentPose.isCustom
                ? "CUSTOM POSE"
                : "EDIT POSE"}
            </Text>
          </View>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <Feather name="x" size={20} color="#7999C1" />
          </Pressable>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title */}
          <Text style={styles.label}>TITLE</Text>
          <TextInput
            style={styles.input}
            value={currentPose.title}
            onChangeText={(v) => updateField("title", v)}
            placeholder="Pose name"
            placeholderTextColor="#7999C1"
          />

          {/* Sanskrit */}
          <Text style={styles.label}>SANSKRIT</Text>
          <TextInput
            style={styles.input}
            value={currentPose.sanskrit || ""}
            onChangeText={(v) => updateField("sanskrit", v)}
            placeholder="Auto-generated or enter manually"
            placeholderTextColor="#7999C1"
          />

          {/* Description */}
          <Text style={styles.label}>DESCRIPTION</Text>
          <Text style={styles.helpText}>
            What you will say while you're teaching.
          </Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={currentPose.description}
            onChangeText={(v) => updateField("description", v)}
            placeholder="Describe the pose cue..."
            placeholderTextColor="#7999C1"
            multiline
            textAlignVertical="top"
          />

          {/* Deepening */}
          <Text style={styles.label}>DEEPENING</Text>
          <Text style={styles.helpText}>
            Optional guidance for students who want to go further.
          </Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={currentPose.deepening || ""}
            onChangeText={(v) => updateField("deepening", v)}
            placeholder="Additional deepening cues..."
            placeholderTextColor="#7999C1"
            multiline
            textAlignVertical="top"
          />

          {/* Additional Notes */}
          <Text style={styles.label}>NOTES</Text>
          <TextInput
            style={[styles.input, styles.inputMultiline]}
            value={currentPose.additionalNotes || ""}
            onChangeText={(v) => updateField("additionalNotes", v)}
            placeholder="Personal notes, reminders..."
            placeholderTextColor="#7999C1"
            multiline
            textAlignVertical="top"
          />
        </ScrollView>

        {/* CTA */}
        <View style={styles.ctaContainer}>
          {isPreview && !isAdded ? (
            <Pressable
              style={[styles.cta, !canSave && styles.ctaDisabled]}
              onPress={handleAddToSection}
              disabled={!canSave}
            >
              <Text style={styles.ctaText}>ADD TO SECTION</Text>
            </Pressable>
          ) : (
            <Pressable
              style={[styles.cta, !canSave && styles.ctaDisabled]}
              onPress={() => router.back()}
              disabled={!canSave}
            >
              <Text style={styles.ctaText}>DONE</Text>
            </Pressable>
          )}
          {!canSave && (
            <Text style={styles.errorText}>
              You must add a title and description in order to save.
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
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
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  backButton: {
    width: 36,
  },
  closeButton: {
    width: 36,
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  eyebrow: {
    color: "#7999C1",
    fontSize: 9,
    fontFamily: "SQMarket-Light",
    letterSpacing: 3.5,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  label: {
    color: "#7999C1",
    fontSize: 9,
    fontFamily: "SQMarket-Light",
    letterSpacing: 3,
    marginBottom: 8,
    marginTop: 16,
  },
  helpText: {
    color: "#7999C1",
    fontSize: 14,
    fontFamily: "CormorantGaramond-Italic",
    marginBottom: 8,
    marginTop: -4,
  },
  input: {
    backgroundColor: "#0d1117",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    color: "#F8F9FA",
    fontSize: 16,
    fontFamily: "CircularStd-Book",
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  inputMultiline: {
    minHeight: 100,
    paddingTop: 16,
    lineHeight: 26,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: "#7999C1",
    fontSize: 14,
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
  ctaDisabled: {
    opacity: 0.3,
  },
  ctaText: {
    color: "#030303",
    fontSize: 11,
    fontFamily: "SQMarket-Bold",
    letterSpacing: 3,
  },
  errorText: {
    color: "#F59E0B",
    fontSize: 13,
    fontFamily: "CircularStd-Book",
    textAlign: "center",
    marginTop: 10,
  },
});
