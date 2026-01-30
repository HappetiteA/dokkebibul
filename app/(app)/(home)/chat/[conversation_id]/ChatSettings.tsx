import DefaultHeader from "@/components/DefaultHeader";
import {
  BlockFailModal,
  BlockModal,
  BlockSuccessModal,
} from "@/components/modals/BlockModals";
import {
  ReportFailModal,
  ReportModal,
  ReportSuccessModal,
} from "@/components/modals/ReportModals";
import { BGStyle } from "@/components/style/commonStyle";
import ShadowWrap from "@/components/style/Shadow";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { useAuth } from "@/contexts/AuthContext";
import { useChatRoom } from "@/contexts/ChatRoomContext";
import useModal from "@/hooks/useModal";
import { supabase } from "@/lib/supabase";
import { CommonActions } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

  return (
    <SafeAreaView style={BGStyle.BG}>
      <DefaultHeader title={"채팅 설정"} />
      <View style={styles.container}>
        {chatRoomData ? (
          <>
            <View>
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
            </View>

            <View>
              <ShadowWrap>
                <TouchableOpacity
                  onPress={() =>
                    openReportModal({
                      onClose: closeReportModal,
                      name: chatRoomData?.other.name,
                      onReportBtnPressed: onReportBtnPressed,
                      reportBtnEnabled: reportBtnEnabled,
                    })
                  }
                >
                  <View style={styles.button}>
                    <Text style={styles.innerButtonText}>신고하기</Text>
                  </View>
                </TouchableOpacity>
              </ShadowWrap>
              <ShadowWrap>
                <TouchableOpacity
                  onPress={() =>
                    openBlockModal({
                      onClose: closeBlockModal,
                      name: chatRoomData?.other.name,
                      onBlockBtnPressed: onBlockBtnPressed,
                      blockBtnEnabled: blockBtnEnabled,
                    })
                  }
                >
                  <View style={styles.button}>
                    <Text style={styles.innerButtonText}>차단하기</Text>
                  </View>
                </TouchableOpacity>
              </ShadowWrap>
              <ShadowWrap>
                <TouchableOpacity>
                  <View style={styles.button}>
                    <Text style={styles.innerButtonText}>채팅방 나가기</Text>
                  </View>
                </TouchableOpacity>
              </ShadowWrap>
            </View>
          </>
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
  h2: {
    fontSize: 24,
    paddingHorizontal: 5,
    color: "#8F8F9A",
  },
  innerButtonText: { textAlign: "center", fontSize: 20, color: "#8F8F9A" },
});
