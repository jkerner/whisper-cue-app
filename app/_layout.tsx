import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { useFonts } from "@expo-google-fonts/cormorant-garamond";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "CormorantGaramond-Light": require("@expo-google-fonts/cormorant-garamond/300Light"),
    "CormorantGaramond-LightItalic": require("@expo-google-fonts/cormorant-garamond/300Light_Italic"),
    "CormorantGaramond-Regular": require("@expo-google-fonts/cormorant-garamond/400Regular"),
    "CormorantGaramond-Italic": require("@expo-google-fonts/cormorant-garamond/400Regular_Italic"),
    "CormorantGaramond-Medium": require("@expo-google-fonts/cormorant-garamond/500Medium"),
    "CormorantGaramond-MediumItalic": require("@expo-google-fonts/cormorant-garamond/500Medium_Italic"),
    "CormorantGaramond-SemiBold": require("@expo-google-fonts/cormorant-garamond/600SemiBold"),
    "CormorantGaramond-Bold": require("@expo-google-fonts/cormorant-garamond/700Bold"),
    "CormorantGaramond-BoldItalic": require("@expo-google-fonts/cormorant-garamond/700Bold_Italic"),
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color="#43B1E8" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: "#030303",
    alignItems: "center",
    justifyContent: "center",
  },
});
