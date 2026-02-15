import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { LinearGradientHeader } from "@/components/Headers";
import { useAuth } from "@/contexts/AuthContext";
import { getConversationIdbyUserId, getFollowings } from "@/services/supabase";
import { SelectFollowingsResponse } from "@/types/orm.types";
import { BGStyle } from "@/components/style/commonStyle";

// Import Shared Components
import { UserListItem } from "@/components/user-list/UserListItem";
import { ListActionButton } from "@/components/user-list/UserListButtons";

export default function FollowingsList() {
  const router = useRouter();
  const { profile } = useAuth();
  const [followings, setFollowings] = useState<SelectFollowingsResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getFollowings();
      setFollowings(followData ?? []);
    })();
  }, []);

  const MoveToOtherProfile = (user_id: string) => {
    router.navigate({
      pathname: "/(app)/(home)/OtherProfile",
      params: { user_id },
    });
  };

  const handleChat = async (user_id: string) => {
    if (!profile) return;
    const conversation_id = await getConversationIdbyUserId(
      profile.user_id,
      user_id,
    );
    if (conversation_id) {
      router.navigate({
        pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
      });
    }
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <LinearGradientHeader title="팔로잉 목록" />
      <FlatList
        data={followings}
        keyExtractor={(item) => item.dst_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserListItem
            name={item.dst_name}
            colorCode={item.dst_color_code}
            onPressProfile={() => MoveToOtherProfile(item.dst_id)}
            RightComponent={
              <ListActionButton
                text="대화하기"
                variant="chat"
                onPress={() => handleChat(item.dst_id)}
              />
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listContent: { padding: 16 },
});
