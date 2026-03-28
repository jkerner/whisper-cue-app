import { useEffect, useState } from "react";
import { View, ActivityIndicator, StyleSheet, Platform } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import * as Font from "expo-font";
import {
  CormorantGaramond_300Light,
  CormorantGaramond_300Light_Italic,
  CormorantGaramond_400Regular,
  CormorantGaramond_400Regular_Italic,
  CormorantGaramond_500Medium,
  CormorantGaramond_500Medium_Italic,
  CormorantGaramond_600SemiBold,
  CormorantGaramond_700Bold,
  CormorantGaramond_700Bold_Italic,
} from "@expo-google-fonts/cormorant-garamond";
import { supabase } from "../src/lib/supabase";
import { Session } from "@supabase/supabase-js";

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [authReady, setAuthReady] = useState(false);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Load fonts
    Font.loadAsync({
      "CormorantGaramond-Light": CormorantGaramond_300Light,
      "CormorantGaramond-LightItalic": CormorantGaramond_300Light_Italic,
      "CormorantGaramond-Regular": CormorantGaramond_400Regular,
      "CormorantGaramond-Italic": CormorantGaramond_400Regular_Italic,
      "CormorantGaramond-Medium": CormorantGaramond_500Medium,
      "CormorantGaramond-MediumItalic": CormorantGaramond_500Medium_Italic,
      "CormorantGaramond-SemiBold": CormorantGaramond_600SemiBold,
      "CormorantGaramond-Bold": CormorantGaramond_700Bold,
      "CormorantGaramond-BoldItalic": CormorantGaramond_700Bold_Italic,
    })
      .then(() => setFontsLoaded(true))
      .catch(() => setFontsLoaded(true));

    // Load auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Redirect based on auth state
  useEffect(() => {
    if (!authReady || !fontsLoaded) return;
    const onAuthScreen = segments[0] === "auth";

    if (!session && !onAuthScreen) {
      router.replace("/auth");
    } else if (session && onAuthScreen) {
      router.replace("/");
    }
  }, [session, segments, authReady, fontsLoaded]);

  // Show loading screen until fonts + auth are ready
  if (!fontsLoaded || !authReady) {
    return (
      <View style={styles.loading}>
        <StatusBar style="light" />
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
