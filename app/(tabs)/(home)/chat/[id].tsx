import DefaultHeader from "@/components/DefaultHeader";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";

export default function Chat() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();

  useEffect(() => {
    navigation.setOptions({ title: `Chat #${id}` });
    console.log(id);
  }, []);
  return (
    <>
      <DefaultHeader></DefaultHeader>
      <View>
        <Text>Hello Chat #{id}</Text>
      </View>
    </>
  );
}
