import DefaultHeader from "@/components/DefaultHeader";
import { Text, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AvatarScreen() {
  return (
    <>
      <DefaultHeader title="Avatar"></DefaultHeader>
      <View>
        <Text>Hello Avatar</Text>
        <TouchableOpacity
          onPress={async () => {
            const sessionStr = await AsyncStorage.getItem("sb-slstnesnhgwtcaxyajjx-auth-token");
            const session = JSON.parse(sessionStr!);
            console.log(session.refresh_token)
            session.refresh_token = "invalid-refresh-token";
            session.access_token = ""
            try {
              await AsyncStorage.setItem("sb-slstnesnhgwtcaxyajjx-auth-token", JSON.stringify(session));
              console.log("Corrupted token written!");
            } catch (e) {
              console.error("setItem error", e);
            }
            const sessionStr2 = await AsyncStorage.getItem("sb-slstnesnhgwtcaxyajjx-auth-token");
            console.log(sessionStr2)
            // await AsyncStorage.clear();
            console.log('corrupted')
            // console.log(AsyncStorage.getAllKeys())
          }}
        >
          <Text>Clear Storage</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
