import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  ScrollView,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { Pose, Sequence } from "../src/types";
import sequencesData from "../src/data/sequences.json";
import posesData from "../src/data/poses.json";
import Svg, { Circle } from "react-native-svg";

const sequences = sequencesData as Sequence[];
const poses = posesData as Pose[];
const sequence = sequences[0];
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const RING_SIZE = SCREEN_WIDTH * 0.55;

function getPose(poseId: string): Pose | undefined {
  return poses.find((p) => p.id === poseId);
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Progress ring
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
      {/* Dashed inner ring */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius - 14}
        stroke="#1a2230"
        strokeWidth={1}
        strokeDasharray="4 6"
        fill="none"
      />
      {/* Background ring */}
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1a2230"
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Progress arc */}
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
  const [currentIndex, setCurrentIndex] = useState(
    startIndex ? parseInt(startIndex, 10) : 0
  );
  const [elapsed, setElapsed] = useState(0);
  const [paused, setPaused] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const totalSteps = sequence.steps.length;
  const step = sequence.steps[currentIndex];
  const pose = getPose(step.poseId);
  const progress = (currentIndex + 1) / totalSteps;

  // Next pose
  const nextStep =
    currentIndex < totalSteps - 1 ? sequence.steps[currentIndex + 1] : null;
  const nextPose = nextStep ? getPose(nextStep.poseId) : null;

  // Timer
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [paused]);

  // Fade transition
  const animateTransition = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setTimeout(callback, 150);
  };

  const goNext = () => {
    if (currentIndex >= totalSteps - 1) {
      router.replace({
        pathname: "/practice-complete",
        params: { elapsed: elapsed.toString() },
      });
      return;
    }
    animateTransition(() => setCurrentIndex((i) => i + 1));
  };

  const goPrev = () => {
    if (currentIndex <= 0) return;
    animateTransition(() => setCurrentIndex((i) => i - 1));
  };

  // Join cues into readable text
  const cueText = step.cues.join(" ");
  const section = (step as any).section || "";
  const adjustment = (step as any).adjustment || "";
  const breaths = (step as any).breaths;

  return (
    <View style={styles.container}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable onPress={() => router.back()} style={styles.topBtn}>
            <Feather name="list" size={18} color="#7999C1" />
          </Pressable>
          <View>
            <Text style={styles.sectionName}>{section}</Text>
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

      {/* Paused overlay */}
      {paused && (
        <View style={styles.pausedBanner}>
          <Text style={styles.pausedText}>PAUSED</Text>
        </View>
      )}

      {/* Progress bar */}
      <View style={styles.progressBarTrack}>
        <View
          style={[styles.progressBarFill, { width: `${progress * 100}%` }]}
        />
      </View>

      {/* Central ring area */}
      <Animated.View style={[styles.ringArea, { opacity: fadeAnim }]}>
        <View style={[styles.ringContainer, { width: RING_SIZE, height: RING_SIZE }]}>
          <ProgressRing progress={progress} size={RING_SIZE} strokeWidth={2.5} />

          {/* Content inside ring */}
          <View style={styles.ringContent}>
            {/* Breath count label */}
            {breaths && (
              <Text style={styles.breathLabel}>
                HOLD {breaths} BREATH{breaths > 1 ? "S" : ""}
              </Text>
            )}

            {/* Pose name */}
            <Text style={styles.poseName}>{pose?.englishName}</Text>

            {/* Sanskrit */}
            {pose?.sanskritName && (
              <Text style={styles.sanskrit}>
                {pose.sanskritName.replace(/^\w/, (c: string) => c.toUpperCase())}
              </Text>
            )}

          </View>
        </View>
      </Animated.View>

      {/* Cue text */}
      <Animated.View style={[styles.cueArea, { opacity: fadeAnim }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.cueScroll}
        >
          <Text style={styles.cueText}>{cueText}</Text>

          {/* Adjustment callout */}
          {adjustment ? (
            <View style={styles.adjustmentRow}>
              <Text style={styles.adjustmentIcon}>⚡</Text>
              <Text style={styles.adjustmentText}>{adjustment}</Text>
            </View>
          ) : null}
        </ScrollView>
      </Animated.View>

      {/* Up Next card — tappable to advance */}
      <Pressable style={styles.upNextCard} onPress={goNext}>
        {nextPose ? (
          <>
            <View style={styles.upNextTop}>
              <Text style={styles.upNextLabel}>UP NEXT</Text>
              <Text style={styles.upNextArrow}>→</Text>
            </View>
            <Text style={styles.upNextName}>{nextPose.englishName}</Text>
            {nextPose.sanskritName && (
              <Text style={styles.upNextSanskrit}>
                {nextPose.sanskritName.replace(/^\w/, (c: string) => c.toUpperCase())}
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

      {/* Back hint — subtle, bottom */}
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

  // Top bar — SQ Market Regular
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#0d1117",
    alignItems: "center",
    justifyContent: "center",
  },
  sectionName: {
    color: "#F8F9FA",
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
  },
  sectionStep: {
    color: "#7999C1",
    fontSize: 11,
    fontVariant: ["tabular-nums"],
    marginTop: 1,
  },
  sectionMuted: {
    color: "#7999C1",
    fontWeight: "400",
  },
  topRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topTimer: {
    color: "#7999C1",
    fontSize: 15,
    fontWeight: "300",
    fontVariant: ["tabular-nums"],
  },
  pausedBanner: {
    alignItems: "center",
    paddingVertical: 6,
  },
  pausedText: {
    color: "#43B1E8",
    fontSize: 9,
    fontWeight: "600",
    letterSpacing: 4,
  },

  // Progress bar
  progressBarTrack: {
    height: 2,
    backgroundColor: "#1a2230",
    marginHorizontal: 24,
    marginBottom: 8,
    borderRadius: 1,
  },
  progressBarFill: {
    height: 2,
    backgroundColor: "#43B1E8",
    borderRadius: 1,
  },

  // Ring
  ringArea: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  ringContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  ringContent: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: RING_SIZE * 0.15,
  },
  // SQ Market Regular, uppercase, tracked
  breathLabel: {
    color: "#43B1E8",
    fontSize: 10,
    fontWeight: "500",
    letterSpacing: 3,
    marginBottom: 8,
  },
  // SQ Market Bold — pose name
  poseName: {
    color: "#F8F9FA",
    fontSize: 26,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  // Cormorant Garamond Italic — Sanskrit in Chandra (light purple)
  sanskrit: {
    color: "#AAA8D6",
    fontSize: 16,
    fontFamily: "CormorantGaramond-Italic",
    fontVariant: ["lining-nums"],
    textAlign: "center",
    marginTop: 2,
  },

  // Cue — Circular (system sans), centered
  cueArea: {
    flex: 1,
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  cueScroll: {
    paddingBottom: 16,
  },
  cueText: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CircularStd-Book",
    fontWeight: "normal",
    lineHeight: 32,
    textAlign: "center",
    opacity: 0.85,
  },
  // SQ Market Regular, uppercase — adjustment
  adjustmentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    marginTop: 16,
    gap: 6,
  },
  adjustmentIcon: {
    fontSize: 12,
    marginTop: 2,
  },
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

  // Up Next card
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
  // SQ Market Regular, uppercase, tracked
  upNextLabel: {
    color: "#7999C1",
    fontSize: 11,
    fontWeight: "500",
    letterSpacing: 3,
  },
  upNextArrow: {
    color: "#43B1E8",
    fontSize: 20,
  },
  // Cormorant Garamond Bold — matches pose name in ring
  upNextName: {
    color: "#F8F9FA",
    fontSize: 24,
    fontFamily: "CircularStd-Bold",
    fontWeight: "normal",
  },
  // Cormorant Garamond Italic
  upNextSanskrit: {
    color: "#43B1E8",
    fontSize: 16,
    fontFamily: "CormorantGaramond-Italic",
    fontVariant: ["lining-nums"],
    marginTop: 4,
  },

  // Back hint
  backHint: {
    alignItems: "center",
    paddingVertical: 12,
  },
  backHintText: {
    color: "#7999C1",
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 2,
    opacity: 0.4,
  },
});
