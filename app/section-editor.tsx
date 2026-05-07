import { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  Modal,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pose, SequencePose } from "../src/types";
import posesData from "../src/data/poses.json";
import { builderStore } from "../src/lib/builder-store";
import poseImages from "../src/lib/pose-images";

const allPoses = (posesData as Pose[]).filter((p) => p.kind === "pose");

// Build a map of english name (lowercase) → sanskrit name for auto-populate
const sanskritLookup: Record<string, string> = {};
for (const p of allPoses) {
  if (p.sanskritName) {
    sanskritLookup[p.englishName.toLowerCase()] = p.sanskritName;
  }
}
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_GAP = 10;
const CARD_SIZE = (SCREEN_WIDTH - 48 - CARD_GAP * 2) / 3;

export default function SectionEditorScreen() {
  const router = useRouter();
  const { sectionId, sectionName } = useLocalSearchParams<{
    sectionId: string;
    sectionName: string;
  }>();
  const [search, setSearch] = useState("");
  const [section, setSection] = useState(builderStore.getSection(sectionId!));
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPoseName, setNewPoseName] = useState("");
  const [newPoseSanskrit, setNewPoseSanskrit] = useState("");
  const [sanskritAutoFilled, setSanskritAutoFilled] = useState(false);
  const [newPoseDescription, setNewPoseDescription] = useState("");
  const [newPoseDeepening, setNewPoseDeepening] = useState("");
  const [newPoseNotes, setNewPoseNotes] = useState("");

  const handlePoseNameChange = (text: string) => {
    setNewPoseName(text);
    // Auto-populate sanskrit if the user hasn't manually edited it
    const match = sanskritLookup[text.trim().toLowerCase()];
    if (match) {
      setNewPoseSanskrit(match);
      setSanskritAutoFilled(true);
    } else if (sanskritAutoFilled) {
      setNewPoseSanskrit("");
      setSanskritAutoFilled(false);
    }
  };

  const handleSanskritChange = (text: string) => {
    setNewPoseSanskrit(text);
    setSanskritAutoFilled(false);
  };

  useEffect(() => {
    return builderStore.subscribe(() => {
      setSection(builderStore.getSection(sectionId!) || undefined);
    });
  }, [sectionId]);

  const addedPoses = section?.poses || [];

  const filteredPoses = useMemo(() => {
    if (!search.trim()) return allPoses;
    const q = search.toLowerCase();
    return allPoses.filter(
      (p) =>
        p.englishName.toLowerCase().includes(q) ||
        (p.sanskritName && p.sanskritName.toLowerCase().includes(q))
    );
  }, [search]);

  // Fast mode: tap + icon, adds instantly, stays on grid
  const quickAddPose = (pose: Pose) => {
    if (!sectionId) return;
    builderStore.addPose(sectionId, pose);
  };

  // Intentional mode: tap card, opens editor as preview with "Add to Section" CTA
  const previewPose = (pose: Pose) => {
    router.push({
      pathname: "/pose-editor",
      params: {
        sectionId,
        sourcePoseId: pose.id,
        mode: "preview",
      },
    });
  };

  const removePose = (index: number) => {
    if (sectionId) builderStore.removePose(sectionId, index);
  };

  const createCustomPose = () => {
    if (!newPoseName.trim() || !newPoseDescription.trim()) return;
    if (!sectionId) return;
    const customPose = builderStore.addCustomPose(
      sectionId,
      newPoseName.trim(),
      newPoseSanskrit.trim() || undefined
    );
    customPose.description = newPoseDescription.trim();
    customPose.deepening = newPoseDeepening.trim() || undefined;
    customPose.additionalNotes = newPoseNotes.trim() || undefined;
    builderStore.addCustomPoseToSection(sectionId, customPose);
    setNewPoseName("");
    setNewPoseSanskrit("");
    setSanskritAutoFilled(false);
    setNewPoseDescription("");
    setNewPoseDeepening("");
    setNewPoseNotes("");
    setShowCreateModal(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={20} color="#43B1E8" />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.eyebrow}>SECTION</Text>
            <Text style={styles.sectionTitle}>
              {sectionName || "Untitled Section"}
            </Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        {/* Added poses strip */}
        {addedPoses.length > 0 && (
          <View style={styles.addedSection}>
            <Text style={styles.addedLabel}>
              {addedPoses.length} POSE{addedPoses.length !== 1 ? "S" : ""} IN
              THIS SECTION
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {addedPoses.map((pose, i) => (
                <View key={`added-${i}`} style={styles.addedChip}>
                  <Pressable
                    style={styles.addedChipTouchable}
                    onPress={() =>
                      router.push({
                        pathname: "/pose-editor",
                        params: { sectionId, poseId: pose.id },
                      })
                    }
                  >
                    {pose.sourcePoseId && poseImages[pose.sourcePoseId] && (
                      <Image
                        source={poseImages[pose.sourcePoseId]}
                        style={styles.addedChipImage}
                        resizeMode="contain"
                      />
                    )}
                    <Text style={styles.addedChipText} numberOfLines={1}>
                      {pose.title}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => removePose(i)}
                    hitSlop={8}
                    style={styles.addedChipRemove}
                  >
                    <Feather name="x" size={12} color="#7999C1" />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Search + Create */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Feather name="search" size={16} color="#7999C1" />
            <TextInput
              style={styles.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search poses..."
              placeholderTextColor="#7999C1"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Feather name="x" size={14} color="#7999C1" />
              </Pressable>
            )}
          </View>
        </View>

        {/* Create custom pose button */}
        <Pressable
          style={styles.createRow}
          onPress={() => setShowCreateModal(true)}
        >
          <Feather name="edit-3" size={14} color="#AAA8D6" />
          <Text style={styles.createText}>CREATE YOUR OWN POSE</Text>
        </Pressable>

        {/* Pose grid */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
        >
          {filteredPoses.map((pose) => {
            const hasImage = !!poseImages[pose.id];
            return (
              <Pressable
                key={pose.id}
                style={styles.poseCard}
                onPress={() => previewPose(pose)}
              >
                {/* Quick-add + button */}
                <Pressable
                  style={styles.quickAddButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    quickAddPose(pose);
                  }}
                  hitSlop={4}
                >
                  <Feather name="plus" size={14} color="#43B1E8" />
                </Pressable>
                {hasImage ? (
                  <Image
                    source={poseImages[pose.id]}
                    style={styles.poseCardImage}
                    resizeMode="contain"
                  />
                ) : (
                  <View style={styles.poseCardPlaceholder}>
                    <Feather name="user" size={24} color="#1a2230" />
                  </View>
                )}
                <Text style={styles.poseCardName} numberOfLines={2}>
                  {pose.englishName}
                </Text>
                {pose.sanskritName && (
                  <Text style={styles.poseCardSanskrit} numberOfLines={1}>
                    {pose.sanskritName}
                  </Text>
                )}
              </Pressable>
            );
          })}

          {filteredPoses.length === 0 && (
            <View style={styles.emptySearch}>
              <Text style={styles.emptyText}>No poses found</Text>
            </View>
          )}
        </ScrollView>

        {/* Done CTA */}
        <View style={styles.ctaContainer}>
          <Pressable style={styles.cta} onPress={() => router.back()}>
            <Text style={styles.ctaText}>
              DONE · {addedPoses.length} POSE
              {addedPoses.length !== 1 ? "S" : ""}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Create Pose Modal */}
      <Modal
        visible={showCreateModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Pose</Text>
              <Pressable onPress={() => setShowCreateModal(false)}>
                <Feather name="x" size={20} color="#7999C1" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.modalLabel}>POSE NAME</Text>
              <TextInput
                style={styles.modalInput}
                value={newPoseName}
                onChangeText={handlePoseNameChange}
                placeholder="e.g. Fallen Triangle"
                placeholderTextColor="#7999C1"
                autoFocus
              />

              <Text style={styles.modalLabel}>SANSKRIT (OPTIONAL)</Text>
              <TextInput
                style={styles.modalInput}
                value={newPoseSanskrit}
                onChangeText={handleSanskritChange}
                placeholder="Auto-fills if pose name matches library"
                placeholderTextColor="#7999C1"
              />

              <Text style={styles.modalLabel}>DESCRIPTION</Text>
              <Text style={styles.modalHelpText}>
                What you will say while you're teaching.
              </Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                value={newPoseDescription}
                onChangeText={setNewPoseDescription}
                placeholder="Describe the pose cue..."
                placeholderTextColor="#7999C1"
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.modalLabel}>DEEPENING (OPTIONAL)</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                value={newPoseDeepening}
                onChangeText={setNewPoseDeepening}
                placeholder="Guidance for students who want to go further..."
                placeholderTextColor="#7999C1"
                multiline
                textAlignVertical="top"
              />

              <Text style={styles.modalLabel}>NOTES (OPTIONAL)</Text>
              <TextInput
                style={[styles.modalInput, styles.modalInputMultiline]}
                value={newPoseNotes}
                onChangeText={setNewPoseNotes}
                placeholder="Personal reminders..."
                placeholderTextColor="#7999C1"
                multiline
                textAlignVertical="top"
              />

              <Pressable
                style={[
                  styles.modalCta,
                  (!newPoseName.trim() || !newPoseDescription.trim()) && styles.ctaDisabled,
                ]}
                onPress={createCustomPose}
                disabled={!newPoseName.trim() || !newPoseDescription.trim()}
              >
                <Text style={styles.ctaText}>ADD TO SECTION</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#0B1119",
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
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  eyebrow: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 3.5,
    marginBottom: 4,
  },
  sectionTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },

  // Added poses horizontal strip
  addedSection: {
    paddingLeft: 24,
    paddingBottom: 12,
  },
  addedLabel: {
    color: "#43B1E8",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 3,
    marginBottom: 8,
  },
  addedChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d1117",
    borderRadius: 20,
    paddingVertical: 6,
    paddingLeft: 6,
    paddingRight: 10,
    marginRight: 8,
    gap: 6,
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  addedChipImage: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  addedChipTouchable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addedChipRemove: {
    padding: 4,
  },
  addedChipText: {
    color: "#F8F9FA",
    fontSize: 12,
    maxWidth: 120,
  },

  // Search
  searchRow: {
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0d1117",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: "#F8F9FA",
    fontSize: 15,
    padding: 0,
  },

  // Create custom
  createRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 10,
    marginHorizontal: 24,
    marginBottom: 8,
  },
  createText: {
    color: "#AAA8D6",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 2.5,
  },

  // Pose grid
  scroll: {
    flex: 1,
  },
  gridContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 24,
    gap: CARD_GAP,
    paddingBottom: 24,
  },
  poseCard: {
    width: CARD_SIZE,
    backgroundColor: "#0d1117",
    borderRadius: 12,
    padding: 8,
    alignItems: "center",
    position: "relative",
  },
  quickAddButton: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#131820",
    borderWidth: 1,
    borderColor: "#1a2230",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  poseCardImage: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
    marginBottom: 6,
  },
  poseCardPlaceholder: {
    width: CARD_SIZE - 16,
    height: CARD_SIZE - 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  poseCardName: {
    color: "#F8F9FA",
    fontSize: 10,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  poseCardSanskrit: {
    color: "#7999C1",
    fontSize: 8,
    textAlign: "center",
    marginTop: 2,
  },
  emptySearch: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    color: "#7999C1",
    fontSize: 14,
    opacity: 0.6,
  },

  // CTA
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
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 3,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#0d1117",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  modalTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  modalLabel: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 3,
    marginBottom: 8,
  },
  modalInput: {
    backgroundColor: "#131820",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 18,
    color: "#F8F9FA",
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  modalInputMultiline: {
    minHeight: 80,
    paddingTop: 16,
  },
  modalHelpText: {
    color: "#7999C1",
    fontSize: 12,
    fontFamily: "CormorantGaramond-Italic",
    marginBottom: 8,
    marginTop: -4,
  },
  modalCta: {
    backgroundColor: "#43B1E8",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
});
