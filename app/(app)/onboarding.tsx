import { Text, View, Button, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/utils/AuthContext";
import { supabase } from "@/utils/supabase";

export default function OnBoarding() {
  const router = useRouter();
  const { session, user, profile } = useAuth();

  const handleOnboarding = async () => {
    if (!user || !user.id || !session) {
      console.log("User session missing");
      Alert.alert("User session missing, please sign in again");
      router.replace("/(auth)/sign-in");
      return;
    }
    if (profile) {
      console.log("User profile already exists in DB");
      Alert.alert("User profile already exists in DB");
      router.replace("/(app)/(tabs)/(home)");
      return;
    }
    try {
      const { error } = await supabase
        .from("profiles")
        .insert(
          {
            user_id: user.id,
            name: 'a',
          },
        );
      if (error) {
        console.log(error);
        Alert.alert(`Failed to insert profile to DB: ${error}`);
      }
    } catch (err: any) {
      console.log(err);
      Alert.alert(`Failed to insert profile to DB: ${err}`);
    }
  }
  
  return (
    <View>
      <Text>Hello Onboarding</Text>
      <TouchableOpacity onPress={handleOnboarding} style={{ top: "300%" }}>
        <Text>initialize user</Text>
      </TouchableOpacity>
    </View>
  );
}
