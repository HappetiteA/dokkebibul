import { Text, TouchableOpacity, View } from "react-native";
import { useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";

export default function MyProfileScreen() {
  return (
    <>
      <MyProfileScreenHeader />
      <View>
        <View></View>
        <Text>Name</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <TouchableOpacity>
          <Text>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function MyProfileScreenHeader() {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const onProfileClick = () => {
    router.navigate("/(tabs)/my-profile");
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity style={headerStyle.button} onPress={onPressBackBtn}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}>
          <TouchableOpacity style={headerStyle.button} onPress={onProfileClick}>
            <Text>Edit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
