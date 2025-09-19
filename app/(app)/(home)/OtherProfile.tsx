import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { getProfileById } from "@/hooks/data";

interface IProfile {
  name: string;
  user_id: string;
}

export default function OtherProfileScreen() {
  const router = useRouter();
  const { user_id } = useLocalSearchParams();
  const [userInfo, setUserInfo] = useState<IProfile>();

  const [follow, setFollow] = useState(false);

  useEffect(() => {
    (async () => {
      if (typeof user_id !== "string") return;

      const profile = await getProfileById(user_id);
      if (profile == null) return;
      setUserInfo(profile);
    })();
  }, []);

  const onFollowBtnPressed = () => {
    setFollow((c) => !c);
  };

  const onChatBtnPressed = () => {
    if (typeof user_id !== "string") return;
    router.navigate({ pathname: "/chat/[id]", params: { id: user_id } });
  };

  return (
    <>
      <OtherProfileScreenHeader />
      <View>
        <Text>{userInfo?.name}</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <View style={styles.horizontalBtn}>
          <TouchableOpacity onPress={onFollowBtnPressed}>
            <Text>{follow ? "팔로우 취소" : "팔로우"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatBtnPressed}>
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
