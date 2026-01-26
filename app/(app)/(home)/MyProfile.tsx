import { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { getFollowers, getFollowings } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import { getAvatarSource } from "@/utils/avatarColor";
import { getAddressPublicity } from "@/services/geocode"; // Adjust path as needed
import React from "react";

// Define the type here if not imported
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

  // Location State
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);

  useFocusEffect(() => {
    async function start() {
      // 1. Fetch Follow Stats
      (async () => {
        const followingData = await getFollowings();
        setFollowingNumber(followingData?.length ?? 0);
      })();
      (async () => {
        const followerData = await getFollowers();
        setFollowerNumber(followerData?.length ?? 0);
      })();

      // 2. Fetch Location Info
      (async () => {
        const data = await getAddressPublicity();
        setLocationInfo(data);
      })();
    }
    start();
  });

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
        address: "비공개",
      };
    }
  };

  const { title, dotColor, address } = getLocationUI();

  return (
    <SafeAreaView style={styles.safeArea}>
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

          <View style={styles.statSpacer} />

          <TouchableOpacity
            style={styles.statItem}
            onPress={() => router.navigate("/FollowersList")}
          >
            <Text style={styles.statNumber}>{followerNumber}</Text>
            <Text style={styles.statLabel}>팔로워</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Status Message Box */}
        <View style={[styles.statusBox, styles.commonShadow]}>
          <Text style={styles.statusText}>{profile?.status_message ?? ""}</Text>
        </View>

        {/* 5. Bottom Location Info (UPDATED) */}
        <View style={styles.locationContainer}>
          <View style={styles.locationTitleRow}>
            <Text style={styles.locationTitle}>{title}</Text>
            <View style={[styles.activeDot, { backgroundColor: dotColor }]} />
          </View>
          <Text style={styles.addressText}>{address}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

// ... (Rest of Header Component and Styles remain unchanged) ...

function MyProfileScreenHeader({ coins }: { coins: number }) {
  const router = useRouter();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        style={styles.headerLeft}
        onPress={() => router.canGoBack() && router.back()}
      >
        <Ionicons name="chevron-back" size={28} color="#aaa" />
      </TouchableOpacity>

      <View style={styles.headerRight}>
        <Text style={styles.cashText}>${coins}</Text>
        <TouchableOpacity
          style={[styles.editButtonCircle, styles.commonShadow]}
          onPress={() => router.navigate("/(app)/(home)/EditProfile")}
        >
          <Ionicons name="pencil" size={16} color="#aaa" />
        </TouchableOpacity>
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
  },
  commonShadow: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarImage: {
    width: 120,
    height: 120,
  },
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
    width: 40,
  },
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
    color: "#999",
    marginRight: 6,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // Background color is now handled dynamically in JSX
  },
  addressText: {
    fontSize: 16,
    color: "#aaa",
  },
  headerContainer: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerLeft: {
    padding: 5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  cashText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#C0C0C0",
    marginRight: 12,
  },
  editButtonCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
});
