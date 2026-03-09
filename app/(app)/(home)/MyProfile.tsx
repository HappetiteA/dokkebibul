import { useCallback, useState } from "react";
import { TouchableOpacity, View, StyleSheet, Image } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import {
  getConversationIdbyUserId,
  getFollowers,
  getFollowings,
} from "@/services/supabase";
import { getAvatarSource } from "@/utils/avatarColor";
import { getAddressPublicity } from "@/services/geocode";
import React from "react";
import headerStyle, { BGStyle } from "@/components/style/commonStyle";
import { SafeAreaView } from "react-native-safe-area-context";
import { ShadowStyle } from "@/components/style/Shadow";
import { supabase } from "@/lib/supabase";
import { BackIcon, EditIcon } from "@/components/style/Icons";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/style/Buttons";

type LocationInfo = {
  addr: string;
  is_public: boolean;
};

export default function MyProfileScreen() {
  const { profile } = useAuth();
  const router = useRouter();

  // Stats State
  const [followingNumber, setFollowingNumber] = useState<number>(0);
  const [followerNumber, setFollowerNumber] = useState<number>(0);
  const [isSelfFollowing, setSelfFollowing] = useState<boolean>(false);

  // Location State
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useFocusEffect(
    useCallback(() => {
      async function start() {
        if (!profile) return;
        // 1. Fetch Follow Stats & Check if user follows itself
        (async () => {
          const followingData = await getFollowings();
          setFollowingNumber(followingData?.length ?? 0);
        })();

        (async () => {
          const followerData = await getFollowers();
          setFollowerNumber(followerData?.length ?? 0);
        })();

        // 2. Check Self following / Call Self following if not
        (async () => {
          const { data } = await supabase
            .from("follows")
            .select("*")
            .eq("src_id", profile.user_id)
            .eq("dst_id", profile.user_id)
            .maybeSingle();

          const isSelfFollowing = data ? true : false;
          if (isSelfFollowing) {
            setSelfFollowing(true);
          } else {
            const { error: followError } = await supabase
              .from("follows")
              .insert({ src_id: profile.user_id, dst_id: profile.user_id });

            if (followError) {
              setSelfFollowing(false);
              console.log(followError.message);
              return;
            }
            setSelfFollowing(true);
          }
        })();

        // 3. Fetch Location Info
        (async () => {
          const data = await getAddressPublicity();
          setLocationInfo(data);
        })();
      }
      start();
    }, [profile]),
  );

  // --- Helper to determine Location UI Status ---
  const getLocationUI = () => {
    if (!locationInfo) {
      return {
        title: "도깨비불 공개",
        dotColor: "#D7D7E2",
        address: "위치 정보 없음",
      };
    }

    if (locationInfo.is_public) {
      return {
        title: "도깨비불 공개",
        dotColor: "#87CEFA",
        address: locationInfo.addr,
      };
    } else {
      return {
        title: "도깨비불 공개",
        dotColor: "#D7D7E2",
        address: locationInfo.addr,
      };
    }
  };

  const { title, dotColor, address } = getLocationUI();

  const onChatBtnPressed = async () => {
    if (profile == null) return;

    const { error: conversationError } = await supabase.rpc(
      "update_conversations_chat_enabled",
      {
        u1id: profile.user_id,
        u2id: profile.user_id,
        new_chat_enabled: true,
      },
    );

    if (conversationError) {
      console.log("Self Chat Error : ", conversationError.message);
      return;
    }

    const conversation_id = await getConversationIdbyUserId(
      profile.user_id,
      profile.user_id,
    );

    if (!conversation_id) {
      console.log("Self Chat Error : Cannot find conversation_id");
      return;
    }

    router.navigate({
      pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
    });
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <MyProfileScreenHeader coins={profile ? profile.coins : 0} />

      <View style={styles.scrollContent}>
        {/* 1. Avatar Image */}
        <View style={styles.avatarContainer}>
          <Image
            source={getAvatarSource(profile?.color_code)}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        {/* 2. Name Tag */}
        <View style={[styles.nameTag, ShadowStyle.pill3d]}>
          <Text style={styles.nameText}>{profile?.name ?? ""}</Text>
        </View>

        {/* 3. Follow Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.navigate("/FollowingsList")}
          >
            <Text style={styles.statNumber} weight="bold">
              {followingNumber}
            </Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </TouchableOpacity>

          <View style={styles.statSpacer} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.navigate("/FollowersList")}
          >
            <Text style={styles.statNumber} weight="bold">
              {followerNumber}
            </Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Status Message Box */}
        <View style={[styles.statusBox, ShadowStyle.pill3d]}>
          <Text
            numberOfLines={3}
            ellipsizeMode="tail"
            style={styles.statusText}
          >
            {profile?.status_message ?? ""}
          </Text>
        </View>

        {/* 5. Bottom Location Info (UPDATED) */}
        <View style={styles.locationContainer}>
          <View style={styles.locationTitleRow}>
            <Text weight="bold" style={styles.locationTitle}>
              {title}
            </Text>
            <View style={[styles.activeDot, { backgroundColor: dotColor }]} />
          </View>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      </View>
      <View style={styles.footerContainer}>
        {isSelfFollowing ? (
          <PillButton
            text="대화하기"
            onPress={onChatBtnPressed}
            variant={"blue"}
            width={145}
            height={44}
          />
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

// ... (Rest of Header Component and Styles remain unchanged) ...

function MyProfileScreenHeader({ coins }: { coins: number }) {
  const router = useRouter();

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        {/* Left: Back Button */}
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={() => router.canGoBack() && router.back()}>
            <BackIcon />
          </TouchableOpacity>
        </View>
        {/* Right: Cash Amount + Edit Button */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginRight: 12,
          }}
        >
          <Image
            source={require("@/assets/icons/cash.png")}
            style={{
              width: 20,
              height: 20,
              marginRight: 4,
              tintColor: "#B4B4B8",
            }}
            resizeMode="contain"
          />
          <Text weight="bold" style={styles.cashText}>
            {coins}
          </Text>

          <TouchableOpacity
            style={[styles.editButtonCircle, ShadowStyle.pill3d]}
            onPress={() => router.navigate("/(app)/(home)/EditProfile")}
          >
            <EditIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
    height: "100%",
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
    backgroundColor: "#f8f8fa",
  },
  nameTag: {
    paddingVertical: 5,
    paddingHorizontal: 30,
    borderRadius: 40,
    marginBottom: 30,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#535361",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "60%",
    marginBottom: 40,
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 15,
  },
  statNumber: {
    fontSize: 24,
    color: "#535361",
  },
  statLabel: {
    fontSize: 14,
    color: "#8F8F9A",
  },
  statSpacer: {
    width: 40,
  },
  statusBox: {
    position: "absolute",
    bottom: "47%",
    width: "80%",
    height: "14%",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 25,
  },
  statusText: {
    color: "#888",
    fontSize: 16,
    textAlign: "center",
  },
  locationContainer: {
    position: "absolute",
    bottom: "25%",
    width: "100%",
    alignItems: "center",
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 18,
    color: "#8F8F9A",
    marginRight: 6,
  },
  activeDot: {
    width: 13,
    height: 13,
    borderRadius: 10,
    marginLeft: 5,
  },
  addressText: {
    fontSize: 16,
    color: "#8F8F9A",
  },

  // -- Header Styles --
  cashText: {
    fontSize: 18,
    color: "#B4B4B8",
    marginRight: 12,
  },
  editButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // -- Button Style --
  footerContainer: {
    position: "absolute",
    bottom: "10%",
    width: "100%",
    alignItems: "center",
  },
});
