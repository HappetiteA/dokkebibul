import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import * as Location from "expo-location";
import NearbyUserViewer from "@/components/NearbyUserViewer";
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
import { getChatRooms, getNearbyUsers } from "@/services/supabase";
import { SafeAreaView } from "react-native-safe-area-context";
import { getOriginalAddress, updateAddressCache } from "@/services/geocode";
import { reverseGeocode } from "@/services/supabase";
import { GPSErrorModal } from "@/components/modals/GPSErrorModal";
import { ChatRoom } from "@/types/model.types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainScreen() {
  const { profile } = useAuth();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "97%"], []);

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
    let watcher: Location.LocationSubscription | null = null;

    async function start() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const startLoc = await Location.getCurrentPositionAsync();
      setMyLocation({
        lat: startLoc.coords.latitude,
        lon: startLoc.coords.longitude,
      });
      const initialData = await getNearbyUsers(
        startLoc.coords.latitude,
        startLoc.coords.longitude,
        2000,
      );
      setNearbyUsersLocations(initialData);

      watcher = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 30000,
        },
        async (loc) => {
          const { latitude, longitude } = loc.coords;
          setMyLocation({ lat: latitude, lon: longitude });
          const data = await getNearbyUsers(latitude, longitude, 2000);
          setNearbyUsersLocations(data);
        },
      );
    }

    start();
    return () => {
      watcher?.remove?.();
    };
  }, []);

  // Chat List Part
  const [chatRooms, setChatRooms] = useState<{ [key: string]: ChatRoom }>({});
  const [reconnectTrigger, setReconnectTrigger] = useState(true);
  const [updateTrigger, setUpdateTrigger] = useState(true);

  useFocusEffect(
    useCallback(() => {
      //AsyncStorage.clear();
      // Load Data & Save to asyncstorage
      (async () => {
        if (!profile) {
          console.error("Accessing Not Permitted");
          return;
        }

        const data = (await getChatRooms()) ?? [];
        let chatRoomData: { [key: string]: ChatRoom } = {};

        data.forEach((value) => {
          chatRoomData[value.id] = value;
        });
        setChatRooms(chatRoomData);
        setReconnectTrigger((c) => !c);
        await new Promise((resolve) => setTimeout(resolve, 500));
        setReconnectTrigger((c) => !c);
      })();
    }, [profile?.user_id]),
  );

  useEffect(() => {
    // AsyncStorage.clear();
    // Load Data & Save to asyncstorage
    if (!profile) {
      console.error("Accessing Not Permitted");
      return;
    }
    if (!chatRooms) {
      console.error("chat room data doesn't exists");
      return;
    }

    const ids = Object.keys(chatRooms).join(",");
    if (!ids) {
      console.log("not ready");
      return;
    }

    const channel = supabase
      .channel(`chatroomlist:${profile.user_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=in.(${ids})`,
        },
        (payload) => {
          //console.log(payload);
          const new_chat = {
            id: payload.new.id,
            conversation_id: payload.new.conversation_id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            is_read: payload.new.is_read,
            is_human: payload.new.is_human,
          };

          setChatRooms((c) => {
            return {
              ...c,
              [new_chat.conversation_id]: {
                ...c[new_chat.conversation_id],
                last_msg: new_chat.content,
                last_msg_created_at: new_chat.created_at,
              },
            };
          });
        },
      )
      .subscribe((status, err) => {
        //console.log(status);
        if (status === "CHANNEL_ERROR") {
          console.error("연결 실패 - 권한이나 설정을 확인하세요.");
          console.log(err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
      console.log("removed");
    };
  }, [profile, reconnectTrigger]);

  useEffect(() => {
    // Update Asyncstorage
    (async () => {
      const pairs: [string, string][] = Object.entries(chatRooms).map(
        ([key, value]) => [`ChatRoomData:${key}`, JSON.stringify(value)],
      );
      await AsyncStorage.multiSet(pairs);
    })();

    // Update Trig.
    setUpdateTrigger((c) => !c);
  }, [chatRooms]);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const onLeaveChatBtnPressed = async (
    chat_id: string,
    other_id: string,
    is_user1: boolean,
  ) => {
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

    setChatRooms((c) => {
      return {
        ...c,
        [chat_id]: {
          ...c[chat_id],
          [is_user1 ? "user1_chat_enabled" : "user2_chat_enabled"]: false,
        },
      };
    });
    setReconnectTrigger((c) => !c);

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

  const onBlockBtnPressed = async (
    chat_id: string,
    other_name: string,
    other_id: string,
    is_user1: boolean,
  ) => {
    setBlockBtnEnabled(false);

    if (!profile) {
      setBlockBtnEnabled(true);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({ src_id: profile.user_id, dst_id: other_id });

    setChatRooms((c) => {
      return {
        ...c,
        [chat_id]: {
          ...c[chat_id],
          [is_user1 ? "user1_chat_enabled" : "user2_chat_enabled"]: false,
        },
      };
    });
    setReconnectTrigger((c) => !c);

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
        <NearbyUserViewer nearbyUsersLocations={nearbyUsersLocations} />

        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          backgroundStyle={{ backgroundColor: "#F8F8FA" }}
          handleStyle={{
            backgroundColor: "#F8F8FA",
            borderRadius: 20,
            boxShadow: "#dfdfdf 0px -6px 6px 0px",
          }}
          handleIndicatorStyle={{
            backgroundColor: "#D7D7E2",
            width: 33,
            height: 6,
          }}
          snapPoints={snapPoints}
          index={1}
        >
          <BottomSheetScrollView>
            <View style={styles.contentContainer}>
              <ChatRoomList
                updateTrigger={updateTrigger}
                openModal={(other_name, other_id, chat_id, is_user1) =>
                  openDetailsModal({
                    onClose: closeDetailsModal,
                    name: other_name,
                    onLeaveChat: () => {
                      closeDetailsModal();
                      openLeaveChatModal({
                        onClose: closeLeaveChatModal,
                        onLeaveChatBtnPressed: () =>
                          onLeaveChatBtnPressed(chat_id, other_id, is_user1),
                        leaveChatBtnEnabled: LeaveChatBtnEnabled,
                      });
                    },
                    onBlock: () => {
                      closeDetailsModal();
                      openBlockModal({
                        onClose: closeBlockModal,
                        name: other_name,
                        onBlockBtnPressed: () =>
                          onBlockBtnPressed(
                            chat_id,
                            other_name,
                            other_id,
                            is_user1,
                          ),
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
          top: 50,
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
