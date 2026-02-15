import {
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import NearbyUserViewer, { startTracking } from "@/components/NearbyUserViewer";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import headerStyle, { BGStyle } from "@/components/style/commonStyle";
import ChatRoomList from "@/components/ChatRoomList";
import useModal from "@/hooks/useModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { ShadowStyle } from "@/components/style/Shadow";
import PlaceModal, { PlaceSuccessModal } from "@/components/modals/PlaceModal";
import {
  PlaceIcon,
  ProfilesIcon,
  SettingsIcon,
} from "@/components/style/Icons";
import {
  BlockModal,
  BlockSuccessModal,
  BlockFailModal,
} from "@/components/modals/BlockModals";
import {
  ReportModal,
  ReportSuccessModal,
  ReportFailModal,
} from "@/components/modals/ReportModals";
import { DetailsModal } from "@/components/modals/DetailsModal";
import {
  LeaveChatModal,
  LeaveChatSuccessModal,
  LeaveChatFailModal,
} from "@/components/modals/LeaveChatModals";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import React from "react";
import { SelectNearbyUsersResponse } from "@/types/orm.types";
import { getNearbyUsers } from "@/services/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOriginalAddress, updateAddressCache } from "@/services/geocode";
import { reverseGeocode } from "@/services/supabase";
import { GPSErrorModal } from "@/components/modals/GPSErrorModal";

export default function MainScreen() {
  const { profile } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "60%", "90%"], []);

  const { open: openDetailsModal, close: closeDetailsModal } =
    useModal(DetailsModal);

  const [LeaveChatBtnEnabled, setLeaveChatBtnEnabled] = useState(true);
  const { open: openLeaveChatModal, close: closeLeaveChatModal } =
    useModal(LeaveChatModal);
  const { open: openLeaveChatSuccessModal, close: closeLeaveChatSuccessModal } =
    useModal(LeaveChatSuccessModal);
  const { open: openLeaveChatFailModal, close: closeLeaveChatFailModal } =
    useModal(LeaveChatFailModal);

  const [blockBtnEnabled, setBlockBtnEnabled] = useState(true);
  const { open: openBlockModal, close: closeBlockModal } = useModal(BlockModal);
  const { open: openBlockSuccessModal, close: closeBlockSuccessModal } =
    useModal(BlockSuccessModal);
  const { open: openBlockFailModal, close: closeBlockFailModal } =
    useModal(BlockFailModal);

  const [reportBtnEnabled, setReportBtnEnabled] = useState(true);
  const { open: openReportModal, close: closeReportModal } =
    useModal(ReportModal);
  const { open: openReportSuccessModal, close: closeReportSuccessModal } =
    useModal(ReportSuccessModal);
  const { open: openReportFailModal, close: closeReportFailModal } =
    useModal(ReportFailModal);

  const { open: openPlaceModal, close: closePlaceModal } = useModal(PlaceModal);
  const [placeBtnEnabled, setPlaceBtnEnabled] = useState(true);

  const { open: openGPSErrorModal, close: closeGPSErrorModal } =
    useModal(GPSErrorModal);

  const { open: openPlaceSuccessModal, close: closePlaceSuccessModal } =
    useModal(PlaceSuccessModal);

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

  useEffect(() => {
    myLocationRef.current = myLocation;
  }, [myLocation]);

  useEffect(() => {
    let watcher: any;
    let interval: any;

    async function start() {
      watcher = await startTracking(async (lat, lon) => {
        setMyLocation({ lat, lon });
      });

      interval = setInterval(async () => {
        const loc = myLocationRef.current;
        // console.log(loc);
        if (!loc) return;
        const data = await getNearbyUsers(loc.lat, loc.lon, 5000);
        setNearbyUsersLocations(data);
      }, 3000);
    }

    start();
    return () => {
      watcher?.remove?.();
      clearInterval(interval);
    };
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const onLeaveChatBtnPressed = async (other_id: string) => {
    setLeaveChatBtnEnabled(false);

    if (!profile) {
      setLeaveChatBtnEnabled(true);
      return;
    }

    const { error } = await supabase.rpc("update_conversations_chat_enabled", {
      u1id: profile.user_id,
      u2id: other_id,
      new_chat_enabled: false,
    });

    closeLeaveChatModal();
    setLeaveChatBtnEnabled(true);
    if (error) {
      console.error(error);
      openLeaveChatFailModal({ onClose: closeLeaveChatFailModal });
    } else {
      openLeaveChatSuccessModal({
        onClose: () => {
          closeLeaveChatSuccessModal();
        },
      });
    }
  };

  const onBlockBtnPressed = async (other_name: string, other_id: string) => {
    setBlockBtnEnabled(false);

    if (!profile) {
      setBlockBtnEnabled(true);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({ src_id: profile.user_id, dst_id: other_id });

    closeBlockModal();
    setBlockBtnEnabled(true);
    if (error) {
      console.error(error);
      openBlockFailModal({ onClose: closeBlockFailModal });
    } else {
      openBlockSuccessModal({
        onClose: () => {
          closeBlockSuccessModal();
        },
        name: other_name,
      });
    }
  };

  const onReportBtnPressed = async (
    other_name: string,
    other_id: string,
    joinedReasons: string,
  ) => {
    setReportBtnEnabled(false);

    if (!profile) {
      setReportBtnEnabled(true);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      src_id: profile.user_id,
      dst_id: other_id,
      reason: joinedReasons,
    });

    closeReportModal();
    setReportBtnEnabled(true);
    if (error) {
      console.error(error);
      openReportFailModal({ onClose: closeReportFailModal });
    } else {
      openReportSuccessModal({
        onClose: () => {
          closeReportSuccessModal();
        },
        name: other_name,
      });
    }
  };

  const onPlaceIconPressed = async () => {
    if (!myLocation || !profile) {
      openGPSErrorModal({
        onClose: closeGPSErrorModal,
      });
      return;
    }

    const origAddrString = await getOriginalAddress();

    const newAddrString = await reverseGeocode(myLocation.lat, myLocation.lon);

    const onPlaceBtnPressed = async () => {
      setPlaceBtnEnabled(false);
      if (!myLocation || !profile) {
        console.error("Failed to fetch current location");
        closePlaceModal();
        openGPSErrorModal({
          onClose: closeGPSErrorModal,
        });
        setPlaceBtnEnabled(true);
        return;
      }
      const { error } = await supabase.from("locations").upsert({
        user_id: profile.user_id,
        location: `POINT(${myLocation.lon} ${myLocation.lat})`,
      });
      if (error) {
        console.error(error);
        setPlaceBtnEnabled(true);
        return;
      }
      await updateAddressCache(newAddrString);
      closePlaceModal();
      setPlaceBtnEnabled(true);
      openPlaceSuccessModal({
        onClose: closePlaceSuccessModal,
        addr: newAddrString,
      });
    };

    openPlaceModal({
      onClose: closePlaceModal,
      origAddr: origAddrString,
      newAddr: newAddrString,
      onPlaceBtnPressed: onPlaceBtnPressed,
      placeBtnEnabled: placeBtnEnabled,
    });
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <MainScreenHeader />
      <GestureHandlerRootView style={styles.container}>
        <NearbyUserViewer
          nearbyUsersLocations={nearbyUsersLocations}
          myLocation={myLocation}
        />

        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          index={1}
        >
          <BottomSheetScrollView>
            <View style={styles.contentContainer}>
              <ChatRoomList
                openModal={(other_name, other_id, chat_id, is_user1) =>
                  openDetailsModal({
                    onClose: closeDetailsModal,
                    name: other_name,
                    onLeaveChat: () => {
                      closeDetailsModal();
                      openLeaveChatModal({
                        onClose: closeLeaveChatModal,
                        onLeaveChatBtnPressed: () =>
                          onLeaveChatBtnPressed(other_id),
                        leaveChatBtnEnabled: LeaveChatBtnEnabled,
                      });
                    },
                    onBlock: () => {
                      closeDetailsModal();
                      openBlockModal({
                        onClose: closeBlockModal,
                        name: other_name,
                        onBlockBtnPressed: () =>
                          onBlockBtnPressed(other_name, other_id),
                        blockBtnEnabled: blockBtnEnabled,
                      });
                    },
                    onReport: () => {
                      closeDetailsModal();
                      openReportModal({
                        onClose: closeReportModal,
                        name: other_name,
                        onReportBtnPressed: (joinedReasons) =>
                          onReportBtnPressed(
                            other_name,
                            other_id,
                            joinedReasons,
                          ),
                        reportBtnEnabled: reportBtnEnabled,
                      });
                    },
                  })
                }
              />
            </View>
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          justifyContent: "center",
          alignItems: "center",
          position: "absolute",
          top: 35,
          left: 10,
        }}
      >
        <TouchableOpacity
          style={[ShadowStyle.pill3d, { borderRadius: 35 }]}
          onPress={onPlaceIconPressed}
        >
          <PlaceIcon />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function MainScreenHeader() {
  const router = useRouter();
  const onProfileClick = () => {
    router.navigate("/(app)/(home)/MyProfile");
  };

  const onSettingsClick = () => {
    router.navigate("/(app)/(home)/Settings");
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}></View>
        <View style={headerStyle.right}>
          <TouchableOpacity
            style={[headerStyle.button, ShadowStyle.pill3d]}
            onPress={onSettingsClick}
          >
            <SettingsIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[headerStyle.button, ShadowStyle.pill3d]}
            onPress={onProfileClick}
          >
            <ProfilesIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F8FA",
  },
  contentContainer: {
    width: "100%",
    height: "auto",
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F8F8FA",
  },
});
