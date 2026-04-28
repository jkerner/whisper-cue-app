import { useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
  PanResponder,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { builderStore } from "../src/lib/builder-store";
import Svg, { Circle } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RING_SIZE = SCREEN_WIDTH * 0.55;

interface TeachStep {
  title: string;
  sanskrit?: string;
  cues: string[];
  adjustment?: string;
  section: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function ProgressRing({
  progress,
  size,
  strokeWidth = 2.5,
}: {
  progress: number;
  size: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius - 14}
        stroke="#1a2230"
        strokeWidth={1}
        strokeDasharray="4 6"
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1a2230"
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#43B1E8"
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        rotation="-90"
        origin={`${size / 2}, ${size / 2}`}
      />
    </Svg>
  );
}

export default function LiveTeachScreen() {
  const router = useRouter();
  const { startIndex } = useLocalSearchParams<{ startIndex?: string }>();

  const steps = useMemo<TeachStep[]>(() => {
    const sections = builderStore.getSections();
    return sections.flatMap((section) =>
      section.poses.map((pose) => ({
        title: pose.title,
        sanskrit: pose.sanskrit || undefined,
        cues: pose.description
          ? pose.description.split("\n").filter((s) => s.trim())
          : [],
        adjustment: pose.deepening || undefined,
        section: section.name,
      }))
    );
  }, []);

  const [currentIndex, setCurrentIndex] = useState(
    startIndex ? parseInt(startIndex, 10) : 0
  );
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const totalSteps = steps.length;
  const step = steps[currentIndex];
  const progress = totalSteps > 0 ? (currentIndex + 1) / totalSteps : 0;
  const nextStep = currentIndex < totalSteps - 1 ? steps[currentIndex + 1] : null;

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, [paused]);

  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
    setTimeout(callback, 150);
  };

  const goNext = () => {
    if (currentIndex >= totalSteps - 1) {
      router.replace({ pathname: "/practice-complete", params: { elapsed: elapsed.toString() } });
      return;
    }
    animateTransition(() => setCurrentIndex((i) => i + 1));
  };

  const goPrev = () => {
    if (currentIndex <= 0) return;
    animateTransition(() => setCurrentIndex((i) => i - 1));
  };

  const [scrubbing, setScrubbing] = useState(false);
  const lastScrubIndex = useRef(currentIndex);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - RING_SIZE / 2;
        const dy = locationY - RING_SIZE / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const ringRadius = RING_SIZE / 2;
        return dist > ringRadius * 0.55 && dist < ringRadius * 1.15;
      },
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => setScrubbing(true),
      onPanResponderMove: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        const dx = locationX - RING_SIZE / 2;
        const dy = locationY - RING_SIZE / 2;
        let angle = Math.atan2(dx, -dy) / (2 * Math.PI);
        if (angle < 0) angle += 1;
        const idx = Math.max(0, Math.min(totalSteps - 1, Math.round(angle * (totalSteps - 1))));
        if (idx !== lastScrubIndex.current) {
          lastScrubIndex.current = idx;
          setCurrentIndex(idx);
        }
      },
      onPanResponderRelease: () => setScrubbing(false),
    })
  ).current;

  if (!step) {
    return (
      <View style={[styles.container, { alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: "#7999C1", fontSize: 15 }}>No sequence loaded.</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 24 }}>
          <Text style={{ color: "#43B1E8", letterSpacing: 2, fontSize: 12 }}>← BACK</Text>
        </Pressable>
      </View>
    );
  }

  const cueText = step.cues.join(" ");

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable onPress={() => router.back()} style={styles.topBtn}>
            <Feather name="list" size={18} color="#7999C1" />
          </Pressable>
          <View>
            <Text style={styles.sectionName}>{step.section}</Text>
            <Text style={styles.sectionStep}>
              {currentIndex + 1}
              <Text style={styles.sectionMuted}> / {totalSteps}</Text>
            </Text>
          </View>
        </View>
        <View style={styles.topRight}>
          <Text style={styles.topTimer}>{formatTime(elapsed)}</Text>
          <Pressable onPress={() => setPaused((p) => !p)} style={styles.topBtn}>
            <Feather
              name={paused ? "play" : "pause"}
              size={18}
              color={paused ? "#43B1E8" : "#7999C1"}
            />
          </Pressable>
        </View>
      </View>

      {paused && (
        <View style={styles.pausedBanner}>
          <Text style={styles.pausedText}>PAUSED</Text>
        </View>
      )}

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Ring */}
      <Animated.View style={[styles.ringArea, { opacity: scrubbing ? 1 : fadeAnim }]}>
        <View
          style={[styles.ringContainer, { width: RING_SIZE, height: RING_SIZE }]}
          {...panResponder.panHandlers}
        >
          <ProgressRing progress={progress} size={RING_SIZE} strokeWidth={2.5} />
          <View style={styles.ringContent}>
            <Text style={styles.poseName}>{step.title}</Text>
            {step.sanskrit && (
              <Text style={styles.sanskrit}>
                {step.sanskrit.replace(/^\w/, (c) => c.toUpperCase())}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>

      {/* Cue text */}
      <Animated.View style={[styles.cueArea, { opacity: fadeAnim }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.cueScroll}>
          <Text style={styles.cueText}>{cueText}</Text>
          {step.adjustment ? (
            <View style={styles.adjustmentRow}>
              <Text style={styles.adjustmentIcon}>⚡</Text>
              <Text style={styles.adjustmentText}>{step.adjustment}</Text>
            </View>
          ) : null}
        </ScrollView>
      </Animated.View>

      {/* Up Next */}
      <Pressable style={styles.upNextCard} onPress={goNext}>
        {nextStep ? (
          <>
            <View style={styles.upNextTop}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextArrow}>→</Text>
            </View>
            <Text style={styles.upNextName}>{nextStep.title}</Text>
            {nextStep.sanskrit && (
              <Text style={styles.upNextSanskrit}>
                {nextStep.sanskrit.replace(/^\w/, (c) => c.toUpperCase())}
              </Text>
            )}
          </>
        ) : (
          <>
            <Text style={styles.upNextLabel}>PRACTICE COMPLETE</Text>
            <Text style={styles.upNextName}>Return to stillness</Text>
          </>
        )}
      </Pressable>

      <Pressable style={styles.backHint} onPress={goPrev}>
        <Text style={styles.backHintText}>← PREVIOUS</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#030303",
    paddingTop: 60,
    paddingBottom: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  topLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionName: { color: "#F8F9FA", fontSize: 12, fontWeight: "600", letterSpacing: 1 },
  sectionStep: { color: "#7999C1", fontSize: 11, fontVariant: ["tabular-nums"], marginTop: 1 },
  sectionMuted: { color: "#7999C1", fontWeight: "400" },
  topRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  topTimer: { color: "#7999C1", fontSize: 15, fontWeight: "300", fontVariant: ["tabular-nums"] },
  pausedBanner: { alignItems: "center", paddingVertical: 6 },
  pausedText: { color: "#43B1E8", fontSize: 9, fontWeight: "600", letterSpacing: 4 },
  progressBarTrack: {
    height: 2,
    backgroundColor: "#1a2230",
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 1,
  },
  progressBarFill: { height: 2, backgroundColor: "#43B1E8", borderRadius: 1 },
  ringArea: { alignItems: "center", justifyContent: "center", paddingVertical: 16 },
  ringContainer: { alignItems: "center", justifyContent: "center" },
  ringContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: RING_SIZE * 0.15,
  },
  poseName: {
    color: "#F8F9FA",
    fontSize: 26,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  sanskrit: {
    color: "#AAA8D6",
    fontSize: 16,
    fontFamily: "CormorantGaramond-Italic",
    textAlign: "center",
    marginTop: 2,
  },
  cueArea: { flex: 1, paddingHorizontal: 32, paddingTop: 20 },
  cueScroll: { paddingBottom: 16 },
  cueText: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Book",
    fontWeight: "normal",
    lineHeight: 32,
    textAlign: "center",
    opacity: 0.85,
  },
  adjustmentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  adjustmentIcon: { fontSize: 12, marginTop: 2 },
  adjustmentText: {
    color: "#F59E0B",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 2,
    textTransform: "uppercase",
    textAlign: "center",
    maxWidth: 300,
    lineHeight: 16,
  },
  upNextCard: {
    marginHorizontal: 24,
    backgroundColor: "#0d1117",
    borderRadius: 16,
    padding: 22,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1a2230",
  },
  upNextTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  upNextLabel: { color: "#7999C1", fontSize: 11, fontWeight: "500", letterSpacing: 3 },
  upNextArrow: { color: "#43B1E8", fontSize: 20 },
  upNextName: {
    color: "#F8F9FA",
    fontSize: 24,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  upNextSanskrit: {
    color: "#43B1E8",
    fontSize: 16,
    fontFamily: "CormorantGaramond-Italic",
    marginTop: 4,
  },
  backHint: { alignItems: "center", paddingVertical: 12 },
  backHintText: { color: "#7999C1", fontSize: 9, fontWeight: "500", letterSpacing: 2, opacity: 0.4 },
});
