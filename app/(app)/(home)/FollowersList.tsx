import DefaultHeader from "@/components/DefaultHeader";
import { getConversationIdbyUserId, getFollowers } from "@/services/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Image,
  StyleSheet,
  ListRenderItem,
} from "react-native";
import { SelectFollowersResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { BGStyle } from "@/components/style/commonStyle";

export default function FollowersList() {
  const router = useRouter();
  const { profile } = useAuth(); // To get current user's ID
  const [followers, setFollowers] = useState<SelectFollowersResponse>([]);

  useEffect(() => {
    (async () => {
      const followData = await getFollowers();
      if (!followData) return;

      // SORTING LOGIC:
      // Put "is_two_way: false" (Not followed back) at the top
      // 0 means no change, -1 means 'a' comes first, 1 means 'b' comes first
      const sortedData = [...followData].sort((a, b) => {
        if (a.is_two_way === b.is_two_way) return 0;
        return a.is_two_way ? 1 : -1; // false comes before true
      });

      setFollowers(sortedData);
    })();
  }, []);

  const MoveToOtherProfile = (user_id: string) => {
    router.navigate({
      pathname: "/(app)/(home)/OtherProfile",
      params: { user_id: user_id },
    });
  };

  const handleChat = async (user_id: string) => {
    // Navigate to chat
    if (profile) {
      const conversation_id = await getConversationIdbyUserId(
        profile.user_id,
        user_id,
      );
      if (!conversation_id) return;
      router.navigate({
        pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
      });
    } else {
      console.error("Cannot move to chat screen: User not authenticated");
    }
  };

  const handleFollowBack = async (targetUserId: string, index: number) => {
    if (!profile) return;

    // Store original value for potential rollback
    const originalTwoWay = followers[index].is_two_way;

    // 1. Optimistic UI Update: Immediately toggle state to "two way"
    // This makes the button switch to "Chat" instantly
    setFollowers((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, is_two_way: true } : item,
      ),
    );

    // 2. API Call to follow back
    const { error } = await supabase
      .from("follows")
      .insert({ src_id: profile.user_id, dst_id: targetUserId });

    if (error) {
      console.error("Follow back failed:", error);
      // Revert change if failed
      setFollowers((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, is_two_way: originalTwoWay } : item,
        ),
      );
    }
  };

  const renderItem: ListRenderItem<SelectFollowersResponse[0]> = ({
    item,
    index,
  }) => (
    <View style={styles.cardContainer}>
      {/* Left Section: Profile Click */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => MoveToOtherProfile(item.src_id)}
      >
        <Image
          source={require("@/assets/from_figma/icon-wisp-list.png")}
          style={styles.avatar}
          resizeMode="contain"
        />
        <Text style={styles.nameText}>{item.src_name}</Text>
      </TouchableOpacity>

      {/* Right Section: Conditional Button */}
      {item.is_two_way ? (
        // Case 1: Two-way follow -> Show "Chat" (White button)
        <TouchableOpacity
          style={styles.chatButton}
          onPress={() => handleChat(item.src_id)}
        >
          <Text style={styles.chatButtonText}>대화하기</Text>
        </TouchableOpacity>
      ) : (
        // Case 2: One-way follow -> Show "Follow Back" (Blue button)
        <TouchableOpacity
          style={styles.followBackButton}
          onPress={() => handleFollowBack(item.src_id, index)}
        >
          <Text style={styles.followBackButtonText}>맞팔로우</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={BGStyle.BG}>
      <DefaultHeader title="팔로워 목록" />
      <View style={styles.container}>
        <FlatList
          data={followers}
          renderItem={renderItem}
          keyExtractor={(item) => item.src_id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginBottom: 12,

    // --- SHADOW EFFECT ---
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    // backgroundColor: "#ffffff", // Removed bg so transparent PNG looks right
    marginRight: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // --- BUTTON STYLES ---

  // 1. Chat Button (White with Border)
  chatButton: {
    borderWidth: 1,
    borderColor: "#d1d1d1",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff", // White bg
  },
  chatButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },

  // 2. Follow Back Button (Blue, No Border)
  followBackButton: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#89CFF0", // Light Blue matching your image
    // You might want to adjust this hex code to match your exact theme color
  },
  followBackButtonText: {
    fontSize: 14,
    color: "#333", // Dark text on light blue
    fontWeight: "600",
  },
});
