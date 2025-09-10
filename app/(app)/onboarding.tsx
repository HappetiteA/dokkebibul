import { Text, View, Button, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { supabase } from "@/utils/supabase";

export default function OnBoarding() {
  const router = useRouter();
  const handleOnboarding = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (!session || sessionError || !session.user) {
      Alert.alert("Error", "User session not found, redirecting to login...");
      router.replace("/(auth)/sign-in");
      return;
    }
    const user = session.user;
    router.replace("/(app)/(tabs)/(home)");
  };
  return (
    <View>
      <Text>Hello Onboarding</Text>
      <TouchableOpacity onPress={handleOnboarding} style={{ top: "300%" }}>
        <Text>initialize user</Text>
      </TouchableOpacity>
    </View>
  );
}
