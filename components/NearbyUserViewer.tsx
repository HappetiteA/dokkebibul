import { SampleCoordinateData } from "@/dev/SampleData";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface Coord {
  lat: number;
  lon: number;
}

interface NearbyUserProp {
  screenWidth: number;
  radius: number;
  angle: number;
}

function haversineDistance(A: Coord, B: Coord): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371000; // 지구 반지름 (미터)

  const lat1Rad = toRadians(A.lat);
  const lat2Rad = toRadians(B.lat);
  const deltaLat = toRadians(B.lat - A.lat);
  const deltaLon = toRadians(B.lon - A.lon);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const MaxRange = 100;

export default function NearbyUserViewer() {
  const { width, height } = Dimensions.get("window");
  const userViewerSize = Math.min(width, height) - 20;
  const router = useRouter();
  const [selfCoord, setSelfCoord] = useState<Coord>(
    SampleCoordinateData.selfCoord
  );
  const [avatarCoordList, setAvatarCoordList] = useState<Array<Coord>>(
    SampleCoordinateData.avatarCoordList
  );

  const getRadius = (avatar: Coord, self: Coord) => {
    const dist = haversineDistance(avatar, self);
    if (dist < MaxRange / 2) {
      return (userViewerSize / 2) * (0.3 + 0.1 * Math.random());
    } else {
      return (userViewerSize / 2) * (0.7 + 0.1 * Math.random());
    }
  };

  const onPressNearbyUser = (index: number) => {
    // Chat... User Profile...
    router.navigate({
      pathname: "/(tabs)/other-profile",
      params: { user_id: index },
    });
  };

  return (
    <View
      style={{
        ...styles.nearbyUserViewer,
        width: userViewerSize,
        height: userViewerSize,
        borderRadius: userViewerSize / 2,
      }}
    >
      {avatarCoordList.map((value, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onPressNearbyUser(index);
          }}
        >
          <NearbyUser
            screenWidth={userViewerSize}
            radius={getRadius(value, selfCoord)}
            angle={(2 * Math.PI * index) / avatarCoordList.length}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function NearbyUser({ screenWidth, radius, angle }: NearbyUserProp) {
  const getPosition = ({ screenWidth, radius, angle }: NearbyUserProp) => {
    const top = screenWidth / 2 - radius * Math.sin(angle) - 25;
    const left = screenWidth / 2 - radius * Math.cos(angle) - 25;
    return { top: top, left: left };
  };

  return (
    <View
      style={{
        ...styles.profileBG,
        ...getPosition({ screenWidth, radius, angle }),
      }}
    >
      <Text>USER</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nearbyUserViewer: {
    backgroundColor: "tomato",
    marginVertical: 20,
  },
  profileBG: {
    width: 50,
    height: 50,
    position: "absolute",
    backgroundColor: "gray",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
