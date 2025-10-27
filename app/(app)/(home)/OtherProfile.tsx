import { StyleSheet, Text, TouchableOpacity, View, Button } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { getProfileById, getFollowings, getChatRooms } from "@/hooks/data";
import ModalChain, { ModalChainRef } from "@/components/ModalChain";
import { useAuth } from "@/utils/AuthContext";

interface IProfile {
  name: string;
  user_id: string;
}

export default function OtherProfileScreen() {
  const router = useRouter();
  const { profile: myProfile } = useAuth();

  const params = useLocalSearchParams();
  const otherUserId = params.user_id as string;

  const [otherProfile, setOtherProfile] = useState<IProfile>();

  const [follow, setFollow] = useState(false);

  const [followBtnEnabled, setFollowBtnEnabled] = useState(true);

  const blockModalChainRef = useRef<ModalChainRef>(null);

  useEffect(() => {
    (async () => {
      const data = await getProfileById(otherUserId);
      if (data == null) return;
      setOtherProfile(data);
    })();

    (async () => {
      const followingsData = await getFollowings();
      if (!followingsData) {
        setFollow(false);
        return;
      }
      followingsData.forEach((following) => {
        if (following.dst_id === otherUserId) {
          setFollow(true);
        }
      });
    })();
  }, [otherUserId]);

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
    if (myProfile == null) return;

    // CHECK LOGIC, is update_conv_chat_enabled is enough for chatting?
    const { error } = await supabase.rpc("update_conversations_chat_enabled", {
      u1id: myProfile.user_id,
      u2id: otherUserId,
      new_chat_enabled: true,
    });

    // temp code.
    var conversation_id: string = "";
    const chatList = await getChatRooms();
    chatList?.forEach((value) => {
      var user1_id = myProfile.user_id;
      var user2_id = otherUserId;
      if (user2_id < user1_id) {
        var temp = user2_id;
        user2_id = user1_id;
        user1_id = temp;
      }

      if (value.user1_id == user1_id && value.user2_id == user2_id) {
        conversation_id = value.id;
      }
    });
    //

    var user_ids = JSON.stringify([myProfile.user_id, otherUserId]);
    var user_names = JSON.stringify([myProfile.name, otherProfile?.name]);

    if (conversation_id != "") {
      router.navigate({
        pathname: "/chat/[id]",
        params: {
          id: conversation_id,
          user_ids: user_ids,
          user_names: user_names,
        },
      });
    }
  };

  return (
    <View>
      <OtherProfileScreenHeader />
      <View>
        <Text>{otherProfile?.name}</Text>
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
                <Text>{otherProfile?.name}님을 차단하시겠습니까?</Text>
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
                <Text>{otherProfile?.name}님을 차단했습니다</Text>
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
