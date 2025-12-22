import { getNearbyUsers } from "@/services/supabase";
import { SelectNearbyUsersResponse } from "@/types/orm.types";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Button,
} from "react-native";
import * as Location from "expo-location";
import { supabase } from "@/lib/supabase";
import useModal from "@/hooks/useModal";

async function startTracking(onUpdate: (lat: number, lon: number) => void) {
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
    }
  );
}

function PlaceModal({
  isOpen,
  onClose,
  origAddr,
  newAddr,
  onPlaceBtnPressed,
  placeBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  origAddr: string | undefined;
  newAddr: string | undefined;
  onPlaceBtnPressed: () => Promise<void>;
  placeBtnEnabled: boolean;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            현 위치에 도깨비불을 데려다 놓을까요?
          </Text>
          <Text style={styles.modalText}>기존 위치: {origAddr}</Text>
          <Text style={styles.modalText}>현 위지: {newAddr}</Text>
          <>
            <Button
              title="네"
              onPress={onPlaceBtnPressed}
              disabled={!placeBtnEnabled}
            />
            <Button title="아니오" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  );
}

export default function NearbyUserViewer() {
  const { profile } = useAuth();

  const { width, height } = Dimensions.get("window");
  const userViewerSize = Math.min(width, height) - 20;
  const router = useRouter();

  const [myLocation, setMyLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const myLocationRef = useRef<{
    lat: number;
    lon: number;
  } | null>(null);

  const [nearbyUsersLocations, setNearbyUsersLocations] =
    useState<SelectNearbyUsersResponse>([]);

  const { open: openPlaceModal, close: closePlaceModal } = useModal(PlaceModal);
  const [placeBtnEnabled, setPlaceBtnEnabled] = useState(true);

  useEffect(() => {
    myLocationRef.current = myLocation;
  }, [myLocation]);

  useEffect(() => {
    let watcher: any;
    let interval: any;

    async function start() {
      watcher = await startTracking(async (lat, lon) => {
        console.log(lat, lon);
        setMyLocation({ lat, lon });
      });

      interval = setInterval(async () => {
        const loc = myLocationRef.current;
        console.log(loc);
        if (!loc) return;
        const data = await getNearbyUsers(loc.lat, loc.lon, 5000);
        setNearbyUsersLocations(data);
        console.log(nearbyUsersLocations);
        console.log(myLocation);
      }, 3000);
    }

    start();
    return () => {
      watcher?.remove?.();
      clearInterval(interval);
    };
  }, []);

  const onPressMyself = async () => {
    setPlaceBtnEnabled(false);
    if (!myLocation || !profile) {
      console.error("Failed to fetch current location");
      setPlaceBtnEnabled(true);
      return;
    }
    const { error } = await supabase.from("locations").upsert({
      user_id: profile.user_id,
      location: `POINT(${myLocation.lon} ${myLocation.lat})`,
    });
    if (error) {
      console.error(error);
    }
    closePlaceModal();
    setPlaceBtnEnabled(true);
  };

  const onPressNearbyUser = (user_id: string) => {
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
        onPress={() =>
          openPlaceModal({
            onClose: closePlaceModal,
            origAddr: profile?.user_id,
            newAddr: `POINT(${myLocation?.lon}, ${myLocation?.lat})`,
            onPlaceBtnPressed: onPressMyself,
            placeBtnEnabled: placeBtnEnabled,
          })
        }
      >
        <NearbyUser
          screenWidth={userViewerSize}
          myLocation={myLocation!}
          userLocation={myLocation!}
          children={<Text>Me</Text>}
        />
      </TouchableOpacity>
      {nearbyUsersLocations?.map((value, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => {
            onPressNearbyUser(value.user_id);
          }}
        >
          <NearbyUser
            screenWidth={userViewerSize}
            myLocation={myLocation!}
            userLocation={{ lat: value.lat, lon: value.lon }}
            children={<Text>{value.name}</Text>}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

function NearbyUser({
  screenWidth,
  myLocation,
  userLocation,
  mapRadiusMeters = 500,
  children,
}: {
  screenWidth: number;
  myLocation: { lat: number; lon: number };
  userLocation: { lat: number; lon: number };
  mapRadiusMeters?: number;
  children: React.ReactNode;
}) {
  if (!myLocation || !userLocation) return null;

  const METERS_PER_DEG_LAT = 111000;
  const center = screenWidth / 2;

  const dx_m =
    (userLocation.lon - myLocation.lon) *
    METERS_PER_DEG_LAT *
    Math.cos((myLocation.lat * Math.PI) / 180);
  const dy_m = (userLocation.lat - myLocation.lat) * METERS_PER_DEG_LAT;

  const pixelsPerMeter = screenWidth / (2 * mapRadiusMeters);
  const x_px = dx_m * pixelsPerMeter;
  const y_px = -dy_m * pixelsPerMeter;

  const top = center + y_px - 25;
  const left = center + x_px - 25;

  if (Math.abs(x_px) > center || Math.abs(y_px) > center) return null;

  return (
    <View
      style={{
        ...styles.profileBG,
        position: "absolute",
        top,
        left,
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
