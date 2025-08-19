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
      router.replace("/login");
      return;
    }
    const user = session.user;
    const { error } = await supabase
      .from("profiles")
      .update({ is_initialized: true })
      .eq("id", user.id);
    if (error) {
      Alert.alert("Error", "Failed to update user profile");
      console.log(error);
      return;
    }
    router.replace("/(home)");
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
