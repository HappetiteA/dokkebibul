import { SelectNearbyUsersResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  Dimensions,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  ImageBackground,
} from "react-native";
import * as Location from "expo-location";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { getAvatarSource } from "@/utils/avatarColor";

// --- CONFIGURATION ---
const MAX_VISIBLE_USERS = 6; // Display top 6 closest people
const CIRCLE_RADIUS_PERCENTAGE = 0.35; // Users placed at 35% of container width from center
const AVATAR_SIZE = 50;
const CENTER_AVATAR_SIZE = 70;
const MAX_RADIUS_METERS = 2000; // 2km limit

export async function startTracking(
  onUpdate: (lat: number, lon: number) => void,
) {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") throw new Error("Location permission denied");

  return await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 3000,
    },
    (loc) => {
      const { latitude, longitude } = loc.coords;
      onUpdate(latitude, longitude);
    },
  );
}

export default function NearbyUserViewer({
  nearbyUsersLocations,
  myLocation,
}: {
  nearbyUsersLocations: SelectNearbyUsersResponse;
  myLocation: {
    lat: number;
    lon: number;
  } | null;
}) {
  const { profile } = useAuth();

  const { width, height } = Dimensions.get("window");
  const userViewerSize = Math.min(width, height) - 20;
  const centerPoint = userViewerSize / 2;
  const placementRadius = userViewerSize * CIRCLE_RADIUS_PERCENTAGE;

  const router = useRouter();

  const visibleUsers = nearbyUsersLocations
    .filter((user) => user.distance <= MAX_RADIUS_METERS)
    .slice(0, MAX_VISIBLE_USERS);

  const onPressNearbyUser = (user_id?: string) => {
    if (!user_id) return;
    if (user_id === profile?.user_id)
      router.navigate("/(app)/(home)/MyProfile");
    else
      router.navigate({
        pathname: "/(app)/(home)/OtherProfile",
        params: { user_id: user_id },
      });
  };

  return (
    <View style={styles.container}>
      <BackgroundAnimation size={userViewerSize} />

      <ImageBackground
        style={{
          width: userViewerSize,
          height: userViewerSize,
          justifyContent: "center",
          alignItems: "center",
        }}
        // Using your existing border asset
        source={require("@/assets/from_figma/MainScreenBorder.png")}
        resizeMode="contain"
      >
        {/* --- 2. Center Avatar (Myself) --- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressNearbyUser(profile?.user_id)}
          style={styles.centerAvatarContainer}
        >
          <Image
            source={getAvatarSource(profile?.color_code)} // Placeholder
            style={{
              width: CENTER_AVATAR_SIZE,
              height: CENTER_AVATAR_SIZE,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* --- 3. Surrounding Avatars (Nearby Users) --- */}
        {visibleUsers.map((user, index) => {
          // Calculate Angle: Spread evenly (360 / count)
          // -90 degrees offset to start from top
          const angleDeg = (360 / visibleUsers.length) * index - 90;
          const angleRad = (angleDeg * Math.PI) / 180;

          // Convert Polar to Cartesian coordinates relative to center
          // x = r * cos(theta), y = r * sin(theta)
          const translateX = placementRadius * Math.cos(angleRad);
          const translateY = placementRadius * Math.sin(angleRad);

          return (
            <TouchableOpacity
              key={user.user_id}
              activeOpacity={0.8}
              onPress={() => onPressNearbyUser(user.user_id)}
              style={[
                styles.nearbyAvatarContainer,
                {
                  // Apply calculated position using transform to keep them centered relative to container center
                  transform: [
                    { translateX: translateX },
                    { translateY: translateY },
                  ],
                },
              ]}
            >
              <Image
                // Using random placeholder avatars based on ID to make them look different
                source={getAvatarSource(user?.user_color_code)}
                style={styles.nearbyAvatarImage}
              />
              {/* Optional: Add name label below avatar if needed */}
              {/* <Text style={styles.nameLabel}>{user.name}</Text> */}
            </TouchableOpacity>
          );
        })}
      </ImageBackground>
    </View>
  );
}

// function NearbyUser({
//   screenWidth,
//   myLocation,
//   userLocation,
//   mapRadiusMeters = 500,
//   children,
// }: {
//   screenWidth: number;
//   myLocation: { lat: number; lon: number };
//   userLocation: { lat: number; lon: number };
//   mapRadiusMeters?: number;
//   children: React.ReactNode;
// }) {
//   if (!myLocation || !userLocation) return null;

//   const METERS_PER_DEG_LAT = 111000;
//   const center = screenWidth / 2;

//   const dx_m =
//     (userLocation.lon - myLocation.lon) *
//     METERS_PER_DEG_LAT *
//     Math.cos((myLocation.lat * Math.PI) / 180);
//   const dy_m = (userLocation.lat - myLocation.lat) * METERS_PER_DEG_LAT;

//   const pixelsPerMeter = screenWidth / (2 * mapRadiusMeters);
//   const x_px = dx_m * pixelsPerMeter;
//   const y_px = -dy_m * pixelsPerMeter;

//   const top = center + y_px - 25;
//   const left = center + x_px - 25;

//   if (Math.abs(x_px) > center || Math.abs(y_px) > center) return null;

//   return (
//     <View
//       style={{
//         ...styles.profileBG,
//         position: "absolute",
//         top,
//         left,
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       {children}
//     </View>
//   );
// }

function BackgroundAnimation({ size }: { size: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 8000, // Slowed down slightly for smoother look
        easing: Easing.linear,
      }),
      -1, // infinite
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }, { scale: 1.2 }],
  }));

  return (
    <View
      pointerEvents="none"
      style={[styles.animContainer, { width: size, height: size }]}
    >
      <Animated.Image
        style={[{ width: size, height: size }, animatedStyle]}
        source={require("@/assets/from_figma/MainScreenBackground.png")}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  animContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  // Center User Styles
  centerAvatarContainer: {
    width: CENTER_AVATAR_SIZE,
    height: CENTER_AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },

  // Nearby User Styles
  nearbyAvatarContainer: {
    position: "absolute", // Absolute relative to the container center
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
    // We don't set top/left here because we use transform in the render loop
  },
  nearbyAvatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  nameLabel: {
    position: "absolute",
    bottom: -15,
    color: "black",
    fontSize: 10,
    fontWeight: "600",
  },
});
