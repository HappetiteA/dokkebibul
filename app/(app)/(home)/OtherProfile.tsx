import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { getProfileById, getFollowings } from "@/hooks/data";
import ModalChain, { ModalChainRef } from "@/components/ModalChain";
import { useAuth } from "@/utils/AuthContext";

interface IProfile {
  name: string;
  user_id: string;
}

export default function OtherProfileScreen() {
  const router = useRouter();
  const { profile } = useAuth();

  const params = useLocalSearchParams();
  const user_id = params.user_id as string;

  const [userInfo, setUserInfo] = useState<IProfile>();

  const [follow, setFollow] = useState(false);

  const [followBtnEnabled, setFollowBtnEnabled] = useState(true);

  const blockModalChainRef = useRef<ModalChainRef>(null);

  useEffect(() => {
    (async () => {
      const profile = await getProfileById(user_id);
      if (profile == null) return;
      setUserInfo(profile);
    })();

    (async () => {
      const followingsData = await getFollowings();
      if (!followingsData) {
        setFollow(false);
        return;
      }
      followingsData.forEach((following) => {
        if (following.dst_id === user_id) {
          setFollow(true);
        }
      });
    })();
  }, [user_id]);

  const onFollowBtnPressed = async () => {
    setFollowBtnEnabled(false);

    if (!profile) {
      setFollowBtnEnabled(true);
      return;
    }

    if (!follow) {
      setFollow(true);
      const { error } = await supabase
        .from("follows")
        .insert({ src_id: profile.user_id, dst_id: user_id });
      if (error) {
        console.error(error);
        setFollow(false);
      }
      setFollowBtnEnabled(true);
    } else {
      setFollow(false);
      const { data, error } = await supabase
        .from("follows")
        .delete()
        .eq("src_id", profile.user_id)
        .eq("dst_id", user_id);
      if (error) {
        console.error(error);
        setFollow(true);
      }
      setFollowBtnEnabled(true);
    }
  };

  const onChatBtnPressed = async () => {
    if (typeof user_id !== "string") return;
    if (profile == null) return;

    const { error } = await supabase.rpc("update_conversations_chat_enabled", {
      u1id: profile.user_id,
      u2id: user_id,
      new_chat_enabled: true,
    });
    router.navigate({ pathname: "/chat/[id]", params: { id: user_id } });
  };

  return (
    <View>
      <OtherProfileScreenHeader />
      <View>
        <Text>{userInfo?.name}</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <View style={styles.horizontalBtn}>
          <TouchableOpacity
            onPress={onFollowBtnPressed}
            disabled={!followBtnEnabled}
          >
            <Text>{follow ? "팔로우 취소" : "팔로우"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatBtnPressed} disabled={!follow}>
            <Text>대화하기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Text>신고하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPressOut={blockModalChainRef.current?.open}>
          <Text>차단하기</Text>
        </TouchableOpacity>
      </View>

      <ModalChain
        ref={blockModalChainRef}
        modals={[
          {
            children: (
              <View>
                <Text>{userInfo?.name}님을 차단하시겠습니까?</Text>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.close}
                >
                  <Text>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.goNext}
                >
                  <Text>차단하기</Text>
                </TouchableOpacity>
              </View>
            ),
          },
          {
            children: (
              <View>
                <Text>{userInfo?.name}님을 차단했습니다</Text>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.goNext}
                >
                  <Text>확인</Text>
                </TouchableOpacity>
              </View>
            ),
          },
        ]}
      />
    </View>
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
