import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore, Section } from "../src/lib/builder-store";

export default function BuilderScreen() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [sections, setSections] = useState<Section[]>(
    builderStore.getSections()
  );
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    return builderStore.subscribe(() => {
      setSections([...builderStore.getSections()]);
    });
  }, []);

  const totalPoses = sections.reduce((sum, s) => sum + s.poses.length, 0);

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
          <Text style={styles.eyebrow}>NEW SEQUENCE</Text>
          <TextInput
            style={styles.titleInput}
            value={title}
            onChangeText={setTitle}
            placeholder="Untitled Sequence"
            placeholderTextColor="#7999C1"
          />
          <TextInput
            style={styles.subtitleInput}
            value={subtitle}
            onChangeText={setSubtitle}
            placeholder="Add a subtitle..."
            placeholderTextColor="#1a2230"
          />

          {/* Stats */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{sections.length}</Text>
              <Text style={styles.metaLabel}>SECTIONS</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaValue}>{totalPoses}</Text>
              <Text style={styles.metaLabel}>POSES</Text>
            </View>
          </View>
        </View>

        {/* Section list */}
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {sections.map((section, i) => {
            const isEditing = editingId === section.id;
            const hasPoses = section.poses.length > 0;

            return (
              <View
                key={section.id}
                style={[styles.sectionCard, hasPoses && styles.sectionCardFilled]}
              >
                {/* Reorder arrows */}
                <View style={styles.reorderCol}>
                  <Pressable
                    onPress={() => builderStore.moveSection(i, "up")}
                    style={styles.arrowButton}
                    disabled={i === 0}
                  >
                    <Feather
                      name="chevron-up"
                      size={14}
                      color={i === 0 ? "#1a2230" : "#7999C1"}
                    />
                  </Pressable>
                  <Pressable
                    onPress={() => builderStore.moveSection(i, "down")}
                    style={styles.arrowButton}
                    disabled={i === sections.length - 1}
                  >
                    <Feather
                      name="chevron-down"
                      size={14}
                      color={
                        i === sections.length - 1 ? "#1a2230" : "#7999C1"
                      }
                    />
                  </Pressable>
                </View>

                {/* Section content — tap to open editor */}
                <Pressable
                  style={styles.sectionContent}
                  onPress={() => {
                    if (isEditing) return;
                    router.push({
                      pathname: "/section-editor",
                      params: {
                        sectionId: section.id,
                        sectionName: section.name || "Untitled Section",
                      },
                    });
                  }}
                  onLongPress={() => setEditingId(section.id)}
                >
                  <Text style={styles.sectionIndex}>{i + 1}</Text>
                  {isEditing ? (
                    <TextInput
                      style={styles.sectionNameInput}
                      value={section.name}
                      onChangeText={(text) =>
                        builderStore.updateSectionName(section.id, text)
                      }
                      onBlur={() => setEditingId(null)}
                      onSubmitEditing={() => setEditingId(null)}
                      autoFocus
                      placeholder="Section name"
                      placeholderTextColor="#1a2230"
                    />
                  ) : (
                    <View style={styles.sectionNameWrap}>
                      <View style={styles.sectionNameCol}>
                        <Text
                          style={[
                            styles.sectionName,
                            !section.name && styles.sectionNameEmpty,
                          ]}
                        >
                          {section.name || "Tap to name"}
                        </Text>
                        {hasPoses && (
                          <Text style={styles.poseCount}>
                            {section.poses.length} POSE
                            {section.poses.length !== 1 ? "S" : ""}
                          </Text>
                        )}
                      </View>
                      <Feather name="chevron-right" size={14} color="#1a2230" />
                    </View>
                  )}
                </Pressable>

                {/* Remove */}
                <Pressable
                  onPress={() => builderStore.removeSection(section.id)}
                  style={styles.removeButton}
                >
                  <Feather name="x" size={14} color="#7999C1" />
                </Pressable>
              </View>
            );
          })}

          {/* Add section button */}
          <Pressable
            style={styles.addButton}
            onPress={() => {
              const newId = builderStore.addSection("");
              setTimeout(() => setEditingId(newId), 100);
            }}
          >
            <Feather name="plus" size={14} color="#43B1E8" />
            <Text style={styles.addButtonText}>ADD SECTION</Text>
          </Pressable>
        </ScrollView>

        {/* Save CTA */}
        <View style={styles.ctaContainer}>
          <Pressable
            style={[
              styles.cta,
              sections.length === 0 && styles.ctaDisabled,
            ]}
            disabled={sections.length === 0}
          >
            <Text style={styles.ctaText}>SAVE SEQUENCE</Text>
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
  titleInput: {
    color: "#F8F9FA",
    fontSize: 26,
    fontFamily: "CircularStd-Bold",
    letterSpacing: -0.3,
    marginBottom: 4,
    padding: 0,
  },
  subtitleInput: {
    color: "#7999C1",
    fontSize: 18,
    fontFamily: "CormorantGaramond-Italic",
    marginBottom: 16,
    padding: 0,
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

  // Section cards
  sectionCard: {
    backgroundColor: "#0d1117",
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
  },
  sectionCardFilled: {
    borderLeftWidth: 3,
    borderLeftColor: "#43B1E8",
  },
  reorderCol: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    gap: 2,
  },
  arrowButton: {
    padding: 4,
  },
  sectionContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 16,
  },
  sectionIndex: {
    color: "#43B1E8",
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
    width: 20,
    textAlign: "center",
  },
  sectionNameWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionNameCol: {
    flex: 1,
  },
  sectionName: {
    color: "#F8F9FA",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.5,
  },
  sectionNameEmpty: {
    color: "#1a2230",
  },
  poseCount: {
    color: "#43B1E8",
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 3,
  },
  sectionNameInput: {
    flex: 1,
    color: "#F8F9FA",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.5,
    padding: 0,
  },
  removeButton: {
    padding: 8,
  },

  // Add button
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1a2230",
    borderStyle: "dashed",
    marginTop: 4,
  },
  addButtonText: {
    color: "#43B1E8",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 3,
  },

  // Save CTA
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
});
