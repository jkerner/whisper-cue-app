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
import { Pose } from "../src/types";
import posesData from "../src/data/poses.json";
import { builderStore } from "../src/lib/builder-store";
import poseImages from "../src/lib/pose-images";

const allPoses = (posesData as Pose[]).filter((p) => p.kind === "pose");
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

  const addPose = (pose: Pose) => {
    if (sectionId) builderStore.addPose(sectionId, pose);
  };

  const removePose = (index: number) => {
    if (sectionId) builderStore.removePose(sectionId, index);
  };

  const createCustomPose = () => {
    if (!newPoseName.trim()) return;
    const pose = builderStore.addCustomPose(
      newPoseName.trim(),
      newPoseSanskrit.trim() || undefined
    );
    addPose(pose);
    setNewPoseName("");
    setNewPoseSanskrit("");
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
                  {poseImages[pose.id] && (
                    <Image
                      source={poseImages[pose.id]}
                      style={styles.addedChipImage}
                      resizeMode="contain"
                    />
                  )}
                  <Text style={styles.addedChipText} numberOfLines={1}>
                    {pose.englishName}
                  </Text>
                  <Pressable onPress={() => removePose(i)}>
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
                onPress={() => addPose(pose)}
              >
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

            <Text style={styles.modalLabel}>POSE NAME</Text>
            <TextInput
              style={styles.modalInput}
              value={newPoseName}
              onChangeText={setNewPoseName}
              placeholder="e.g. Fallen Triangle"
              placeholderTextColor="#7999C1"
              autoFocus
            />

            <Text style={styles.modalLabel}>SANSKRIT (OPTIONAL)</Text>
            <TextInput
              style={styles.modalInput}
              value={newPoseSanskrit}
              onChangeText={setNewPoseSanskrit}
              placeholder="e.g. Patita Trikonasana"
              placeholderTextColor="#7999C1"
            />

            <Pressable
              style={[
                styles.modalCta,
                !newPoseName.trim() && styles.ctaDisabled,
              ]}
              onPress={createCustomPose}
              disabled={!newPoseName.trim()}
            >
              <Text style={styles.ctaText}>ADD TO SECTION</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalCta: {
    backgroundColor: "#43B1E8",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
  },
});
