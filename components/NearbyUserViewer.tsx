import { SelectNearbyUsersResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
const MAX_RADIUS_METERS = 2000; // 2km limit
const AVATAR_SIZE = 40;
const CENTER_AVATAR_SIZE = 60;
const MAX_VISIBLE_USERS = 6; // Display top 6 closest people

// Slot Configuration
const INNER_RING_COUNT = 6;
const OUTER_RING_COUNT = 12;
const INNER_RADIUS_PCT = 0.28; // Distance from center (28% of view size)
const OUTER_RADIUS_PCT = 0.42; // Distance from center (42% of view size)

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

// Fisher-Yates Shuffle
function shuffleArray(array: number[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export default function NearbyUserViewer({
  nearbyUsersLocations,
}: {
  nearbyUsersLocations: SelectNearbyUsersResponse;
}) {
  const { profile } = useAuth();
  const router = useRouter();

  const { width, height } = Dimensions.get("window");
  const userViewerSize = Math.min(width, height) - 20;

  // 1. ONE-TIME SETUP: Generate "Orbital Slots" with a random global rotation
  // This ensures the map looks different every time you open the app,
  // but stays consistent while you are using it.
  const slots = useMemo(() => {
    const seedRotation = Math.random() * 360; // Global random rotation (0-360 deg)
    const _slots: { x: number; y: number; id: number }[] = [];
    let slotIdCounter = 0;

    // Helper to add a ring of slots
    const addRing = (count: number, radiusPct: number, offsetDeg: number) => {
      const radius = userViewerSize * radiusPct;
      for (let i = 0; i < count; i++) {
        // Calculate angle: (360 / count * index) + random_seed + ring_offset
        const angleDeg = (360 / count) * i + seedRotation + offsetDeg;
        const angleRad = (angleDeg * Math.PI) / 180;

        // Add slight randomness (jitter) to the slot itself so it's not a perfect circle
        const jitterX = Math.random() * 10 - 5; // -5 to +5 px
        const jitterY = Math.random() * 10 - 5;

        _slots.push({
          id: slotIdCounter++,
          x: radius * Math.cos(angleRad) + jitterX,
          y: radius * Math.sin(angleRad) + jitterY,
        });
      }
    };

    // Create Inner Ring
    addRing(INNER_RING_COUNT, INNER_RADIUS_PCT, 0);
    // Create Outer Ring (Offset by 15deg so they don't align perfectly with inner ring)
    addRing(OUTER_RING_COUNT, OUTER_RADIUS_PCT, 15);

    return _slots;
  }, [userViewerSize]);

  // 2. STATE: Map User IDs to Slot IDs
  // Structure: { "user_uuid_123": 0, "user_uuid_456": 5 }
  const [userSlotMap, setUserSlotMap] = useState<Record<string, number>>({});

  useEffect(() => {
    // Filter valid users first
    const validUsers = nearbyUsersLocations
      .filter((user) => user.distance <= MAX_RADIUS_METERS)
      .slice(0, MAX_VISIBLE_USERS);

    setUserSlotMap((prevMap) => {
      const newMap = { ...prevMap };

      // 1. Identify currently occupied slots (by users who are still here)
      const occupiedSlotIndices = new Set<number>();

      Object.keys(newMap).forEach((userId) => {
        const stillHere = validUsers.find((u) => u.user_id === userId);
        if (!stillHere) {
          // User left? Free up their slot.
          delete newMap[userId];
        } else {
          // User still here? Mark slot as taken.
          occupiedSlotIndices.add(newMap[userId]);
        }
      });

      // 2. Identify ALL available slots
      const availableSlots: number[] = [];
      for (let i = 0; i < slots.length; i++) {
        if (!occupiedSlotIndices.has(i)) {
          availableSlots.push(i);
        }
      }

      // 3. Assign slots to new users randomly
      // We shuffle the available slots array so we don't always pick index 0
      shuffleArray(availableSlots);

      validUsers.forEach((user) => {
        // If user doesn't have a slot yet...
        if (newMap[user.user_id] === undefined) {
          if (availableSlots.length > 0) {
            // Pop a random slot from the available pool
            const randomSlot = availableSlots.pop();
            if (randomSlot !== undefined) {
              newMap[user.user_id] = randomSlot;
            }
          }
        }
      });

      return newMap;
    });
  }, [nearbyUsersLocations, slots]);

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
        source={require("@/assets/from_figma/MainScreenBorder.png")}
        resizeMode="contain"
      >
        {/* --- Center Avatar (Myself) --- */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onPressNearbyUser(profile?.user_id)}
          style={styles.centerAvatarContainer}
        >
          <Image
            source={getAvatarSource(profile?.color_code)}
            style={{
              width: CENTER_AVATAR_SIZE,
              height: CENTER_AVATAR_SIZE,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* --- Nearby Users (Mapped via Slots) --- */}
        {nearbyUsersLocations.map((user) => {
          const slotId = userSlotMap[user.user_id];
          // If user hasn't been assigned a slot yet (or map is full), don't render
          if (slotId === undefined) return null;

          const pos = slots[slotId];

          return (
            <TouchableOpacity
              key={user.user_id}
              activeOpacity={0.8}
              onPress={() => onPressNearbyUser(user.user_id)}
              style={[
                styles.nearbyAvatarContainer,
                {
                  // Apply the fixed slot position
                  transform: [{ translateX: pos.x }, { translateY: pos.y }],
                },
              ]}
            >
              <Image
                source={getAvatarSource(user?.user_color_code)}
                style={styles.nearbyAvatarImage}
              />
            </TouchableOpacity>
          );
        })}
      </ImageBackground>
    </View>
  );
}

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
  centerAvatarContainer: {
    width: CENTER_AVATAR_SIZE,
    height: CENTER_AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  nearbyAvatarContainer: {
    position: "absolute",
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  nearbyAvatarImage: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
});
