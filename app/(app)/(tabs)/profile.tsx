import DefaultHeader from "@/components/DefaultHeader";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuthActions } from "@/utils/auth";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const { logout } = useAuthActions();
  const { profile } = useAuth();
  const router = useRouter();

  return (
    <>
      <DefaultHeader title="Profile"></DefaultHeader>
      <View>
        <Text>Hello Profile</Text>
        <Text>{profile?.id}</Text>
        <Text>{!!profile ? 1 : 0}</Text>
        <TouchableOpacity
        onPress={async () => {
          try {
            await logout();
            router.replace('/(auth)/sign-in');
          } catch (err: any) {
            Alert.alert('Logout Error', err.message);
          }
        }}
      >
        <Text>Sign Out</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}
