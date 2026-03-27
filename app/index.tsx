import { View, Text, Image, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Logo icon */}
        <Image
          source={require("../assets/poses/whisper-cue.png")}
          style={styles.logoIcon}
          resizeMode="contain"
        />

        <Text style={styles.title}>Whisper Cue</Text>
        <Text style={styles.subtitle}>
          REAL-TIME CUEING FOR YOGA TEACHERS
        </Text>

        <Pressable
          style={styles.card}
          onPress={() => router.push("/sequence")}
        >
          <Text style={styles.cardEyebrow}>READY TO TEACH</Text>
          <Text style={styles.cardTitle}>
            Root & Rise — 60 Min Power Vinyasa
          </Text>
          <Text style={styles.cardMeta}>133 CUES · ~60 MIN</Text>
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
  logoIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontFamily: "CormorantGaramond-LightItalic",
    color: "#F8F9FA",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 9,
    fontWeight: "500",
    letterSpacing: 3,
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
    fontSize: 9,
    letterSpacing: 3.5,
    fontWeight: "500",
    marginBottom: 8,
  },
  cardTitle: {
    color: "#F8F9FA",
    fontSize: 20,
    fontFamily: "CormorantGaramond-Bold",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  cardMeta: {
    color: "#7999C1",
    fontSize: 9,
    letterSpacing: 2,
  },
});
