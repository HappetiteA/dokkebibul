import { Text, View, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

export default function Splash() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!session || sessionError || !session.user) {
        Alert.alert("Error", "User session not found, redirecting to login...");
        router.replace("/login");
        return;
      }

      const user = session.user;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_initialized")
        .eq("id", user.id)
        .single();

      if (error || !profile) {
        router.replace("/login"); // fallback
        return;
      }

      if (!profile.is_initialized) {
        router.replace("/onboarding");
      } else {
        router.replace("/(tabs)/(home)");
      }
    };

    checkAuthAndNavigate().finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#888" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
