import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Whisper Cue</Text>
        <Text style={styles.subtitle}>
          Real-time cueing for yoga teachers
        </Text>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/sequence")}
        >
          <Text style={styles.cardEyebrow}>READY TO TEACH</Text>
          <Text style={styles.cardTitle}>
            Rise & Root — 60 Min Power Vinyasa
          </Text>
          <Text style={styles.cardMeta}>123 cues · ~60 min</Text>
        </Pressable>
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
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: "300",
    fontStyle: "italic",
    color: "#F8F9FA",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#7999C1",
    marginBottom: 64,
  },
  card: {
    backgroundColor: "#0d1117",
    borderRadius: 16,
    padding: 24,
    width: "100%",
  },
  cardEyebrow: {
    color: "#43B1E8",
    fontSize: 10,
    letterSpacing: 3.5,
    marginBottom: 8,
  },
  cardTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  cardMeta: {
    color: "#7999C1",
    fontSize: 13,
  },
});
