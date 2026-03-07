import DefaultHeader from "@/components/Headers";
import {
  BlockFailModal,
  BlockModal,
  BlockSuccessModal,
} from "@/components/modals/BlockModals";
import { LeaveChatModal, LeaveChatSuccessModal, LeaveChatFailModal } from "@/components/modals/LeaveChatModals";
import {
  ReportFailModal,
  ReportModal,
  ReportSuccessModal,
} from "@/components/modals/ReportModals";
import { BGStyle } from "@/components/style/commonStyle";
import { ShadowStyle } from "@/components/style/Shadow";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { useAuth } from "@/contexts/AuthContext";
import { useChatRoom } from "@/contexts/ChatRoomContext";
import useModal from "@/hooks/useModal";
import { supabase } from "@/lib/supabase";
import { CommonActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React from "react";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "@/components/Text";
import { PillButton } from "@/components/style/Buttons";

export default function ChatSettings() {
  const navigation = useNavigation();
  const { chatRoomData, setNotiEnabled } = useChatRoom();
  const { profile } = useAuth();

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

  const [leaveChatBtnEnabled, setLeaveChatBtnEnabled] = useState(true);
  const { open: openLeaveChatModal, close: closeLeaveChatModal } =
    useModal(LeaveChatModal);
  const { open: openLeaveChatSuccessModal, close: closeLeaveChatSuccessModal } =
    useModal(LeaveChatSuccessModal);
  const { open: openLeaveChatFailModal, close: closeLeaveChatFailModal } =
    useModal(LeaveChatFailModal);

  const onBlockBtnPressed = async () => {
    setBlockBtnEnabled(false);

    if (!profile) {
      setBlockBtnEnabled(true);
      return;
    }

    if (!chatRoomData) {
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({ src_id: profile.user_id, dst_id: chatRoomData?.other.user_id });

    closeBlockModal();
    setBlockBtnEnabled(true);
    if (error) {
      console.error(error);
      openBlockFailModal({ onClose: closeBlockFailModal });
    } else {
      openBlockSuccessModal({
        onClose: () => {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "index",
                  params: { refreshTimeStamp: Date.now() },
                },
              ],
            }),
          );
          closeBlockSuccessModal();
        },
        name: chatRoomData?.other.name,
      });
    }
  };

  const onReportBtnPressed = async (joinedReasons: string) => {
    setReportBtnEnabled(false);

    if (!profile || !chatRoomData) {
      setReportBtnEnabled(true);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      src_id: profile.user_id,
      dst_id: chatRoomData?.other.user_id,
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
        name: chatRoomData?.other.name,
      });
    }
  };

  const onLeaveChatBtnPressed = async () => {
    setLeaveChatBtnEnabled(false);

    if (!profile || !chatRoomData?.other?.user_id) {
      setLeaveChatBtnEnabled(true);
      return;
    }

    const { error } = await supabase.rpc("update_conversations_chat_enabled", {
      u1id: profile.user_id,
      u2id: chatRoomData?.other?.user_id,
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
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [
                {
                  name: "index",
                  params: { refreshTimeStamp: Date.now() },
                },
              ],
            }),
          );
          closeLeaveChatSuccessModal();
        },
      });
    }
  };

  return (
    <SafeAreaView style={BGStyle.BG}>
      <DefaultHeader title={"채팅 설정"} />
      <View style={styles.container}>
        {chatRoomData ? (
          <View style={{ height: "100%" }}>
            <View style={[styles.settingListElement, { marginTop: 40 }]}>
              <Text weight="bold" style={styles.h1}>
                알림 설정
              </Text>
            </View>
            <View style={styles.settingListElement}>
              <Text style={styles.h2}>채팅 알림</Text>
              <NeumorphicSwitch
                width={54}
                height={30}
                padding={3}
                value={chatRoomData?.me.noti_enabled}
                onValueChange={() => {
                  setNotiEnabled(!chatRoomData?.me.noti_enabled);
                }}
                onColor="#93D7EA"
                offColor="#D7D7E2"
              />
            </View>

            <View
              style={[
                styles.settingListElement,
                {
                  position: "absolute",
                  justifyContent: "space-between",
                  bottom: "10%",
                  alignItems: "center",
                  height: "20%",
                  alignSelf: "center",
                  flexDirection: "column",
                },
              ]}
            >
              <PillButton
                text="신고하기"
                onPress={() =>
                  openReportModal({
                    onClose: closeReportModal,
                    name: chatRoomData?.other.name,
                    onReportBtnPressed: onReportBtnPressed,
                    reportBtnEnabled: reportBtnEnabled,
                  })
                }
                variant={"white"}
                width={170}
                height={40}
              />
              <PillButton
                text="차단하기"
                onPress={() =>
                  openBlockModal({
                    onClose: closeBlockModal,
                    name: chatRoomData?.other.name,
                    onBlockBtnPressed: onBlockBtnPressed,
                    blockBtnEnabled: blockBtnEnabled,
                  })
                }
                variant={"white"}
                width={170}
                height={40}
              />
              <PillButton
                text="채팅방 나가기"
                onPress={() =>
                  openLeaveChatModal({
                    onClose: closeLeaveChatModal,
                    onLeaveChatBtnPressed: onLeaveChatBtnPressed,
                    leaveChatBtnEnabled: leaveChatBtnEnabled,
                  })
                }
                variant={"gray"}
                width={170}
                height={40}
              />
            </View>
          </View>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
  },
  settingListElement: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    marginHorizontal: "auto",
    marginVertical: 10,
    justifyContent: "space-between",
  },

  button: {
    backgroundColor: "#F8F8FA",
    borderRadius: 30,
    marginVertical: 10,
    width: 180,
    marginHorizontal: "auto",
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
  h1: {
    fontSize: 20,
    color: "#8F8F9A",
  },
  h2: {
    fontSize: 20,
    paddingHorizontal: 10,
    color: "#8F8F9A",
  },
  innerButtonText: { textAlign: "center", fontSize: 20, color: "#8F8F9A" },
});
