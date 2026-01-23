import DefaultHeader from "@/components/DefaultHeader";
import { getFollowings } from "@/services/supabase";
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
import { SelectFollowingsResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { SafeAreaView } from "react-native-safe-area-context";
import { BGStyle } from "@/components/style/commonStyle";

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
      params: { user_id: user_id },
    });
  };

  const handleChat = (user_id: string) => {
    if (profile) {
      router.navigate({
        pathname: "/(app)/(home)/chat/ChatScreen",
        params: { user1_id: profile?.user_id, user2_id: user_id },
      });
    } else {
      console.error("Cannot move to chat screen: User not authenticated");
    }
  };

  const renderItem: ListRenderItem<SelectFollowingsResponse[0]> = ({
    item,
  }) => (
    <View style={styles.cardContainer}>
      {/* Left Section: Profile Click */}
      <TouchableOpacity
        style={styles.profileSection}
        onPress={() => MoveToOtherProfile(item.dst_id)}
      >
        <Image
          source={require("@/assets/from_figma/icon-wisp-list.png")}
          style={styles.avatar}
        />
        <Text style={styles.nameText}>{item.dst_name}</Text>
      </TouchableOpacity>

      {/* Right Section: Chat Button (Bordered Text) */}
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => handleChat(item.dst_id)}
      >
        <Text style={styles.chatButtonText}>대화하기</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={BGStyle.BG}>
      <DefaultHeader title="팔로잉 목록" />
      <View style={styles.container}>
        <FlatList
          data={followings}
          renderItem={renderItem}
          keyExtractor={(item) => item.dst_id}
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
    backgroundColor: "#f9f9f9", // Slightly off-white background for the screen to make white cards pop
  },
  listContent: {
    padding: 16,
  },
  cardContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff", // White background
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 30, // Higher border radius for the fully rounded pill look
    marginBottom: 12,

    // --- SHADOW EFFECT ---
    boxShadow: "0px 0px 2px 2px #ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Essential for Android shadow
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#ffffff",
    marginRight: 12,
  },
  nameText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  // --- BUTTON STYLES ---
  chatButton: {
    borderWidth: 1,
    borderColor: "#d1d1d1", // Light gray border
    borderRadius: 20, // Rounded pill shape
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "transparent",
  },
  chatButtonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
});
