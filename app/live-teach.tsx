import { View, Text, StyleSheet } from "react-native";

export default function LiveTeachScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Live Teach — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: "#fff",
  },
});
