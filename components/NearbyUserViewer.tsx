import { SampleCoordinateData } from "@/dev/SampleData";
import { getNearbyWisps, ILocation, IOtherLocation } from "@/hooks/data";
import useCurrentLocation from "@/hooks/useCurrentLocation";
import { useAuth } from "@/utils/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface NearbyUserProp {
  screenWidth: number;
  radius: number;
  angle: number;
  children: React.ReactNode;
}

function haversineDistance(A: ILocation, B: ILocation): number {
  const toRadians = (degrees: number) => degrees * (Math.PI / 180);

  const R = 6371000; // 지구 반지름 (미터)

  const lat1Rad = toRadians(A.latitude);
  const lat2Rad = toRadians(B.latitude);
  const deltaLat = toRadians(B.latitude - A.latitude);
  const deltaLon = toRadians(B.longitude - A.longitude);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// const MaxRange = 100;

export default function NearbyUserViewer() {
  // const { location, errorMsg, refreshLocation } = useCurrentLocation();
  const { profile } = useAuth();
  const user_id = profile?.user_id;

  const { width, height } = Dimensions.get("window");
  const userViewerSize = Math.min(width, height) - 20;
  const router = useRouter();

  // const [selfCoord, setSelfCoord] = useState<ILocation>();
  const [avatarData, setAvatarData] = useState<Array<IOtherLocation>>();

  useEffect(() => {
    const getNearbyAvatarData = async () => {
      if (profile != null) {
        if (user_id == undefined) return;

        const data = await getNearbyWisps(user_id);
        console.log(data);
        setAvatarData(data ?? []);
      }
    };

    getNearbyAvatarData();
  }, [user_id]);

  // const getRadius = (avatar: ILocation, self: ILocation) => {
  //   const dist = haversineDistance(avatar, self);
  //   if (dist < MaxRange / 2) {
  //     return (userViewerSize / 2) * (0.3 + 0.1 * Math.random());
  //   } else {
  //     return (userViewerSize / 2) * (0.7 + 0.1 * Math.random());
  //   }
  // };

  const onPressNearbyUser = (user_id: string) => {
    // Chat... User Profile...
    router.navigate({
      pathname: "/(app)/(home)/OtherProfile",
      params: { user_id: user_id },
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
      <TouchableOpacity
        onPress={() => {
          router.navigate("/(app)/(home)/MyProfile");
        }}
      >
        <NearbyUser
          screenWidth={userViewerSize}
          radius={0}
          angle={0}
          children={<Text>Me</Text>}
        />
      </TouchableOpacity>
      {avatarData?.map((value, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onPressNearbyUser(value.user_id);
          }}
        >
          <NearbyUser
            screenWidth={userViewerSize}
            radius={100}
            angle={(2 * Math.PI * index) / avatarData.length}
            children={<Text>User</Text>}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface getPosInput {
  screenWidth: number;
  radius: number;
  angle: number;
}

function NearbyUser({ screenWidth, radius, angle, children }: NearbyUserProp) {
  const getPosition = ({ screenWidth, radius, angle }: getPosInput) => {
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
      {children}
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
