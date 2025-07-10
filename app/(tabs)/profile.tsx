import { Text, TouchableOpacity, View } from "react-native";
import { handleLogout } from "@/utils/auth";

export default function Profile() {
  return (
    <View>
      <Text>Hello Profile</Text>
      <TouchableOpacity
        onPress={handleLogout}
      >
        <Text>log out</Text>
      </TouchableOpacity>
    </View>
  );
}
