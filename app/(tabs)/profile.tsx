import DefaultHeader from "@/components/DefaultHeader";
import { Text, View } from "react-native";

export default function ProfileScreen() {
  return (
    <>
      <DefaultHeader title="Profile"></DefaultHeader>
      <View>
        <Text>Hello Profile</Text>
      </View>
    </>
  );
}
