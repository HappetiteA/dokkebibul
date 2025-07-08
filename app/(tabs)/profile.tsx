import DefaultHeader from "@/components/DefaultHeader";
import { Text, View } from "react-native";

export default function Profile() {
  return (
    <>
      <DefaultHeader title="Profile"></DefaultHeader>
      <View>
        <Text>Hello Profile</Text>
      </View>
    </>
  );
}
