import DefaultHeader from "@/components/DefaultHeader";
import { Text, TouchableOpacity, View } from "react-native";
import { handleLogout } from "@/utils/auth";

export default function ProfileScreen() {
  return (
    <>
      <DefaultHeader title="Profile"></DefaultHeader>
      <View>
        <Text>Hello Profile</Text>
        <TouchableOpacity
        onPress={handleLogout}
      >
        <Text>log out</Text>
      </TouchableOpacity>
    </View>
    </>
  );
}
