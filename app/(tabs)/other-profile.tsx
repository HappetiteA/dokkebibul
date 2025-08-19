import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";

export default function OtherProfileScreen() {
  const { user_id } = useLocalSearchParams();
  console.log(user_id);

  return (
    <>
      <OtherProfileScreenHeader />
      <View>
        <Text>Name #{user_id}</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <View style={styles.horizontalBtn}>
          <TouchableOpacity>
            <Text>팔로우</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>대화하기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text>신고하기</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>차단하기</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

function OtherProfileScreenHeader() {
  const router = useRouter();
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity style={headerStyle.button} onPress={onPressBackBtn}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalBtn: {
    flexDirection: "row",
  },
});
