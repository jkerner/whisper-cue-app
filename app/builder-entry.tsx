import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore } from "../src/lib/builder-store";
import { supabase } from "../src/lib/supabase";

interface SavedSequence {
  id: string;
  name: string;
  description: string | null;
  estimated_minutes: number | null;
  sections: any[];
  created_at: string;
}

export default function BuilderEntryScreen() {
  const router = useRouter();
  const [savedSequences, setSavedSequences] = useState<SavedSequence[]>([]);
  const [loadingSequences, setLoadingSequences] = useState(true);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    const fetchSequences = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoadingSequences(false); return; }
      const { data } = await supabase
        .from("sequences")
        .select("id, name, description, estimated_minutes, sections, created_at")
        .eq("user_id", user.id)
        .order("updated_at", { ascending: false });
      setSavedSequences(data || []);
      setLoadingSequences(false);
    };
    fetchSequences();
  }, []);

  const handleStartFromScratch = () => {
    builderStore.reset();
    router.push("/builder");
  };

  const handleUseExisting = () => {
    setShowPicker(true);
  };

  const handleSelectSequence = (seq: SavedSequence) => {
    builderStore.setSections(seq.sections || []);
    setShowPicker(false);
    router.push({
      pathname: "/builder",
      params: {
        sequenceId: seq.id,
        sequenceName: seq.name,
        sequenceSubtitle: seq.description || "",
      },
    });
  };

  const handleUseTemplate = () => {
    router.push("/template-picker");
  };

  const hasExistingSequences = savedSequences.length > 0;

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
            <Feather name="chevron-right" size={18} color="#7999C1" />
          </Pressable>

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
            <Feather name="chevron-right" size={18} color="#7999C1" />
          </Pressable>

          <Pressable
            style={[
              styles.optionCard,
              !hasExistingSequences && styles.optionCardDisabled,
            ]}
            onPress={handleUseExisting}
            disabled={!hasExistingSequences && !loadingSequences}
          >
            <View
              style={[
                styles.optionIcon,
                !hasExistingSequences && styles.optionIconDisabled,
              ]}
            >
              {loadingSequences ? (
                <ActivityIndicator size="small" color="#43B1E8" />
              ) : (
                <Feather
                  name="layers"
                  size={22}
                  color={hasExistingSequences ? "#43B1E8" : "#1a2230"}
                />
              )}
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
                {loadingSequences
                  ? "Loading your sequences..."
                  : hasExistingSequences
                  ? `${savedSequences.length} saved sequence${savedSequences.length !== 1 ? "s" : ""}`
                  : "No saved sequences yet"}
              </Text>
            </View>
            <Feather
              name="chevron-right"
              size={18}
              color={hasExistingSequences ? "#7999C1" : "#1a2230"}
            />
          </Pressable>
        </View>
      </View>

      {/* Sequence picker modal */}
      <Modal visible={showPicker} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Sequences</Text>
              <Pressable onPress={() => setShowPicker(false)}>
                <Feather name="x" size={20} color="#7999C1" />
              </Pressable>
            </View>
            <FlatList
              data={savedSequences}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.sequenceRow}
                  onPress={() => handleSelectSequence(item)}
                >
                  <View style={styles.sequenceRowText}>
                    <Text style={styles.sequenceName}>{item.name}</Text>
                    {item.description ? (
                      <Text style={styles.sequenceDesc}>{item.description}</Text>
                    ) : null}
                  </View>
                  <Feather name="chevron-right" size={16} color="#7999C1" />
                </Pressable>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#030303" },
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 12 },
  backButton: { width: 36 },
  titleArea: { paddingHorizontal: 24, paddingBottom: 32 },
  eyebrow: { color: "#43B1E8", fontSize: 9, letterSpacing: 3.5, marginBottom: 12 },
  title: {
    color: "#F8F9FA",
    fontSize: 32,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.5,
    lineHeight: 40,
    marginBottom: 12,
  },
  subtitle: {
    color: "#7999C1",
    fontSize: 15,
    fontFamily: "CormorantGaramond-Italic",
    lineHeight: 22,
  },
  options: { paddingHorizontal: 24, gap: 12 },
  optionCard: {
    backgroundColor: "#0d1117",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#1a2230",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  optionCardDisabled: { opacity: 0.35 },
  optionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "#0a1628",
    borderWidth: 1,
    borderColor: "#1e3a5f",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconDisabled: { backgroundColor: "#0d1117", borderColor: "#1a2230" },
  optionText: { flex: 1, gap: 5 },
  optionTitle: {
    color: "#F8F9FA",
    fontSize: 16,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: 0.2,
  },
  optionTitleDisabled: { color: "#3a4a5c" },
  optionDesc: { color: "#7999C1", fontSize: 13, lineHeight: 18 },
  optionDescDisabled: { color: "#1e2a38" },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#0d1117",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderColor: "#1a2230",
    paddingTop: 24,
    paddingBottom: 48,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  modalTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  sequenceRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#131820",
  },
  sequenceRowText: { flex: 1 },
  sequenceName: {
    color: "#F8F9FA",
    fontSize: 16,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    marginBottom: 3,
  },
  sequenceDesc: { color: "#7999C1", fontSize: 13 },
});
