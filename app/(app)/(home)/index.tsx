import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Link, useRouter } from "expo-router";
import NearbyUserViewer from "@/components/NearbyUserViewer";
import { useCallback, useMemo, useRef, useState } from "react";
import headerStyle from "@/components/style/headerStyle";
import ChatRoomList from "@/components/ChatRoomList";
import useModal from "@/hooks/useModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ShadowWrap from "@/components/style/Shadow";
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
import { LeaveChatModal, LeaveChatSuccessModal, LeaveChatFailModal } from "@/components/modals/LeaveChatModals";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";


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

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
  }, []);

  const onLeaveChatBtnPressed = async (chat_id: string, is_user1: boolean) => {
    setLeaveChatBtnEnabled(false);

    if (!profile) {
      setLeaveChatBtnEnabled(true);
      return;
    }

    const { error } = await supabase
      .from("conversations")
      .update(is_user1 ? { user1_chat_enabled: false } : { user2_chat_enabled: false })
      .eq('id', chat_id);

    closeLeaveChatModal();
    setLeaveChatBtnEnabled(true);
    if (error) {
      console.error(error);
      openLeaveChatFailModal({ onClose: closeLeaveChatFailModal });
    } else {
      openLeaveChatSuccessModal({
        onClose: closeLeaveChatSuccessModal
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

  const onReportBtnPressed = async (other_name: string, other_id: string, joinedReasons: string) => {
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

  return (
    <>
      <MainScreenHeader />
      <GestureHandlerRootView style={styles.container}>
        <NearbyUserViewer />

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
                        onLeaveChatBtnPressed: () => onLeaveChatBtnPressed(chat_id, is_user1),
                        leaveChatBtnEnabled: LeaveChatBtnEnabled
                      })
                    },
                    onBlock: () => {
                      closeDetailsModal();
                      openBlockModal({
                        onClose: closeBlockModal,
                        name: other_name,
                        onBlockBtnPressed: () =>
                          onBlockBtnPressed(other_name, other_id),
                        blockBtnEnabled: blockBtnEnabled,
                      })
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
                            joinedReasons
                          ),
                        reportBtnEnabled: reportBtnEnabled,
                      })
                    }
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
        <ShadowWrap>
          <TouchableOpacity onPress={() => {}}>
            <PlaceIcon />
          </TouchableOpacity>
        </ShadowWrap>
      </View>
    </>
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
          <ShadowWrap>
            <TouchableOpacity
              style={headerStyle.button}
              onPress={onSettingsClick}
            >
              <SettingsIcon />
            </TouchableOpacity>
          </ShadowWrap>
          <ShadowWrap>
            <TouchableOpacity
              style={headerStyle.button}
              onPress={onProfileClick}
            >
              <ProfilesIcon />
            </TouchableOpacity>
          </ShadowWrap>
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
