import { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowers, getFollowings } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { getAvatarSource } from "@/utils/avatarColor";
import React from "react";
import headerStyle from "@/components/style/commonStyle";

export default function MyProfileScreen() {
  const { profile } = useAuth();
  const router = useRouter();
  const [followingNumber, setFollowingNumber] = useState<number>(0);
  const [followerNumber, setFollowerNumber] = useState<number>(0);

  useEffect(() => {
    async function start() {
      (async () => {
        const followingData = await getFollowings();
        setFollowingNumber(followingData?.length ?? 0);
      })();
      (async () => {
        const followerData = await getFollowers();
        setFollowerNumber(followerData?.length ?? 0);
      })();
    }
    start();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <MyProfileScreenHeader coins={profile ? profile.coins : 0} />

      <View style={styles.scrollContent}>
        {/* 1. Avatar Image (Transparent, No Border) */}
        <View style={styles.avatarContainer}>
          <Image
            source={getAvatarSource(profile?.color_code)} // Placeholder
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        {/* 2. Name Tag (Pill shape + Shadow) */}
        <View style={[styles.nameTag, styles.commonShadow]}>
          <Text style={styles.nameText}>{profile?.name ?? ""}</Text>
        </View>

        {/* 3. Follow Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.navigate("/FollowingsList")}
          >
            <Text style={styles.statNumber}>{followingNumber}</Text>
            <Text style={styles.statLabel}>팔로잉</Text>
          </TouchableOpacity>

          {/* Spacer between stats */}
          <View style={styles.statSpacer} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.navigate("/FollowersList")}
          >
            <Text style={styles.statNumber}>{followerNumber}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Status Message Box (Large + Shadow) */}
        <View style={[styles.statusBox, styles.commonShadow]}>
          <Text style={styles.statusText}>{profile?.status_message ?? ""}</Text>
        </View>

        {/* 5. Bottom Location Info */}
        <View style={styles.locationContainer}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>도깨비불 공개</Text>
            <View style={styles.activeDot} />
          </View>
          <Text style={styles.addressText}>강남구 봉은사로 81길</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// --- Header Component ---
function MyProfileScreenHeader({ coins }: { coins: number }) {
  const router = useRouter();

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        {/* Left: Back Button */}
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={() => router.canGoBack() && router.back()}>
            <Ionicons name="chevron-back" size={28} color="#aaa" />
          </TouchableOpacity>
        </View>
        {/* Right: Cash Amount + Edit Button */}
        <View style={[headerStyle.right, { alignItems: "center" }]}>
          <Text style={styles.cashText}>${coins}</Text>

          <TouchableOpacity
            style={[styles.editButtonCircle, styles.commonShadow]}
            onPress={() => router.navigate("/(app)/(home)/EditProfile")}
          >
            <Ionicons name="pencil" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA", // Light off-white background
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 40,
  },

  // -- Shared Shadow Style --
  commonShadow: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 }, // Offset to bottom-right
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // -- Avatar --
  avatarContainer: {
    marginBottom: 20,
    // No background or border for the avatar container itself
  },
  avatarImage: {
    width: 120,
    height: 120,
  },

  // -- Name Tag --
  nameTag: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 30,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },

  // -- Stats (Following/Follower) --
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
    fontSize: 22,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#888",
  },
  statSpacer: {
    width: 40, // Space between the two stats
  },

  // -- Status Box --
  statusBox: {
    width: "85%",
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  statusText: {
    color: "#888",
    fontSize: 16,
  },

  // -- Bottom Location Info --
  locationContainer: {
    alignItems: "center",
  },
  locationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#999", // Greyish title
    marginRight: 6,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#87CEFA", // Light Blue Dot
  },
  addressText: {
    fontSize: 16,
    color: "#aaa",
  },

  // -- Header Styles --
  cashText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C0C0C0", // Light grey for money
    marginRight: 12,
  },
  editButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    // Common shadow applies here for the pencil button
  },
});
