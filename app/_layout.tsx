import { useEffect } from "react";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";

export default function RootLayout() {
  useEffect(() => {
    Font.loadAsync({
      "CormorantGaramond-Light": require("@expo-google-fonts/cormorant-garamond/300Light"),
      "CormorantGaramond-LightItalic": require("@expo-google-fonts/cormorant-garamond/300Light_Italic"),
      "CormorantGaramond-Regular": require("@expo-google-fonts/cormorant-garamond/400Regular"),
      "CormorantGaramond-Italic": require("@expo-google-fonts/cormorant-garamond/400Regular_Italic"),
      "CormorantGaramond-Medium": require("@expo-google-fonts/cormorant-garamond/500Medium"),
      "CormorantGaramond-MediumItalic": require("@expo-google-fonts/cormorant-garamond/500Medium_Italic"),
      "CormorantGaramond-SemiBold": require("@expo-google-fonts/cormorant-garamond/600SemiBold"),
      "CormorantGaramond-Bold": require("@expo-google-fonts/cormorant-garamond/700Bold"),
      "CormorantGaramond-BoldItalic": require("@expo-google-fonts/cormorant-garamond/700Bold_Italic"),
      "DancingScript-Regular": require("@expo-google-fonts/dancing-script/400Regular"),
      "DancingScript-Bold": require("@expo-google-fonts/dancing-script/700Bold"),
    }).catch(() => {
      // Fonts failed to load — app still works with system fonts
    });
  }, []);

  return (
    <>
      <StatusBar style="light" />
      <Slot />
    </>
  );
}
