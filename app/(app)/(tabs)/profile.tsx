import DefaultHeader from "@/components/DefaultHeader";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuthActions } from "@/utils/auth";

export default function ProfileScreen() {
  const { logout } = useAuthActions();

  return (
    <>
      <DefaultHeader title="Profile"></DefaultHeader>
      <View>
        <Text>Hello Profile</Text>
        <TouchableOpacity
        onPress={async () => {
          try {
            await logout();
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
