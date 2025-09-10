import DefaultHeader from "@/components/DefaultHeader";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AvatarScreen() {
  return (
    <>
      <DefaultHeader title="Avatar"></DefaultHeader>
      <View>
        <Text>Hello Avatar</Text>
      </View>
    </>
  );
}
