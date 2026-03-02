import React, { useCallback, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useFocusEffect } from "expo-router";

import { LinearGradientHeader } from "@/components/Headers";
import { useAuth } from "@/contexts/AuthContext";
import { getConversationIdbyUserId, getFollowers } from "@/services/supabase";
import { supabase } from "@/lib/supabase";
import { SelectFollowersResponse } from "@/types/orm.types";
import { BGStyle } from "@/components/style/commonStyle";

import { UserListItem } from "@/components/user-list/UserListItem";
import { ListActionButton } from "@/components/user-list/UserListButtons";

export default function FollowersList() {
  const router = useRouter();
  const { profile } = useAuth();
  const [followers, setFollowers] = useState<SelectFollowersResponse>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchFollowers = async () => {
        const followData = await getFollowers();
        if (!followData || !isActive) return;

        // Sorting: One-way first? Original logic: two_way ? 1 : -1 puts Two-way at bottom.
        const sortedData = [...followData].sort((a, b) => {
          if (a.is_two_way === b.is_two_way) return 0;
          return a.is_two_way ? 1 : -1;
        });
        setFollowers(sortedData);
      };
      fetchFollowers();
      return () => {
        isActive = false;
      };
    }, []),
  );

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

  const handleFollowBack = async (targetUserId: string, index: number) => {
    if (!profile) return;
    const originalTwoWay = followers[index].is_two_way;

    // Optimistic Update
    setFollowers((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, is_two_way: true } : item,
      ),
    );

    const { error } = await supabase
      .from("follows")
      .insert({ src_id: profile.user_id, dst_id: targetUserId });

    if (error) {
      console.error("Follow back failed:", error);
      setFollowers((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, is_two_way: originalTwoWay } : item,
        ),
      );
    }
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <LinearGradientHeader title="팔로워 목록" />
      <FlatList
        data={followers}
        keyExtractor={(item) => item.src_id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <UserListItem
            name={item.src_name}
            colorCode={item.src_color_code}
            onPressProfile={() => MoveToOtherProfile(item.src_id)}
            RightComponent={
              item.is_two_way ? (
                <ListActionButton
                  text="대화하기"
                  variant="chat"
                  onPress={() => handleChat(item.src_id)}
                />
              ) : (
                <ListActionButton
                  text="맞팔로우"
                  variant="followBack"
                  onPress={() => handleFollowBack(item.src_id, index)}
                />
              )
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
