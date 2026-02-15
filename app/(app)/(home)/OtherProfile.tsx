import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { useLocalSearchParams, useRouter, useNavigation } from "expo-router";
import { CommonActions } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  getProfileById,
  getFollowings,
  getConversationIdbyUserId,
} from "@/services/supabase";
import useModal from "@/hooks/useModal";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/types/model.types";
import { Ionicons } from "@expo/vector-icons";
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
import { getAvatarSource } from "@/utils/avatarColor";
import headerStyle from "@/components/style/commonStyle";
import { CloseModal, OpenModalOptions } from "@/types/modal";
import { BackIcon, BlockIcon, ReportIcon } from "@/components/style/Icons";
import { ShadowStyle } from "@/components/style/Shadow";
import { SafeAreaView } from "react-native-safe-area-context";
import { PillButton } from "@/components/style/Buttons";

export default function OtherProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { profile } = useAuth();
  const params = useLocalSearchParams();
  const user_id = params.user_id as string;

  const [userInfo, setUserInfo] = useState<Profile>();

  const [follow, setFollow] = useState(false);
  const [followBtnEnabled, setFollowBtnEnabled] = useState(true);

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

  useEffect(() => {
    (async () => {
      const profile = await getProfileById(user_id);
      if (profile == null) return;
      setUserInfo(profile);
    })();

    (async () => {
      const followingsData = await getFollowings();
      if (!followingsData) {
        setFollow(false);
        return;
      }
      followingsData.forEach((following) => {
        if (following.dst_id === user_id) {
          setFollow(true);
        }
      });
    })();
  }, [user_id]);

  const onFollowBtnPressed = async () => {
    setFollowBtnEnabled(false);

    if (!profile) {
      setFollowBtnEnabled(true);
      return;
    }

    if (!follow) {
      setFollow(true);
      const { error } = await supabase
        .from("follows")
        .insert({ src_id: profile.user_id, dst_id: user_id });
      if (error) {
        console.error(error);
        setFollow(false);
      }
      setFollowBtnEnabled(true);
    } else {
      setFollow(false);
      const { data, error } = await supabase
        .from("follows")
        .delete()
        .eq("src_id", profile.user_id)
        .eq("dst_id", user_id);
      if (error) {
        console.error(error);
        setFollow(true);
      }
      setFollowBtnEnabled(true);
    }
  };

  const onBlockBtnPressed = async () => {
    setBlockBtnEnabled(false);

    if (!profile) {
      setBlockBtnEnabled(true);
      return;
    }

    const { error } = await supabase
      .from("blocks")
      .insert({ src_id: profile.user_id, dst_id: user_id });

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
        name: userInfo?.name,
      });
    }
  };

  const onReportBtnPressed = async (joinedReasons: string) => {
    setReportBtnEnabled(false);

    if (!profile) {
      setReportBtnEnabled(true);
      return;
    }

    const { error } = await supabase.from("reports").insert({
      src_id: profile.user_id,
      dst_id: user_id,
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
        name: userInfo?.name,
      });
    }
  };

  const onChatBtnPressed = async () => {
    if (typeof user_id !== "string") return;
    if (profile == null) return;

    const { error } = await supabase.rpc("update_conversations_chat_enabled", {
      u1id: profile.user_id,
      u2id: user_id,
      new_chat_enabled: true,
    });

    const conversation_id = await getConversationIdbyUserId(
      profile.user_id,
      user_id,
    );
    if (!conversation_id) return;
    router.navigate({
      pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {userInfo ? (
        <>
          <OtherProfileScreenHeader
            userInfo={userInfo}
            openReportModal={openReportModal}
            closeReportModal={closeReportModal}
            onReportBtnPressed={onReportBtnPressed}
            reportBtnEnabled={reportBtnEnabled}
            openBlockModal={openBlockModal}
            closeBlockModal={closeBlockModal}
            onBlockBtnPressed={onBlockBtnPressed}
            blockBtnEnabled={blockBtnEnabled}
          />

          <View style={styles.scrollContent}>
            {/* Avatar Section - Transparent, No Border, No Shadow */}
            <View style={styles.avatarContainer}>
              <Image
                source={getAvatarSource(userInfo?.color_code)}
                style={styles.avatarImage}
                resizeMode="contain"
              />
            </View>

            {/* Name Tag - With Shadow */}
            <View style={[ShadowStyle.pill3d, styles.nameTag]}>
              <Text style={styles.nameText}>{userInfo?.name ?? ""}</Text>
            </View>

            {/* Status Message Box - With Shadow */}
            <View style={[ShadowStyle.pill3d, styles.statusBox]}>
              <Text style={styles.statusText}>
                {userInfo?.status_message ?? ""}
              </Text>
            </View>

            {/* Action Buttons Container - Fixed Width */}
            <View style={styles.actionButtonContainer}>
              {!follow ? (
                // State 1: Single Button
                <PillButton
                  text="팔로우"
                  onPress={onFollowBtnPressed}
                  variant="blue"
                  width={140}
                  height={50}
                  disabled={!followBtnEnabled}
                />
              ) : (
                // State 2: Two Buttons
                <View style={styles.doubleButtonRow}>
                  <PillButton
                    text="팔로우 취소"
                    onPress={onFollowBtnPressed}
                    variant="gray"
                    width={140}
                    height={50}
                    disabled={!followBtnEnabled}
                  />

                  <PillButton
                    text="대화하기"
                    onPress={onChatBtnPressed}
                    variant="blue"
                    width={140}
                    height={50}
                  />
                </View>
              )}
            </View>
          </View>
        </>
      ) : (
        <ErrorOtherProfileScreenHeader />
      )}
    </SafeAreaView>
  );
}

interface OtherProfileScreenHeaderProp {
  userInfo: Profile;
  openReportModal: (
    props: Omit<
      {
        isOpen: boolean;
        onClose: () => void;
        name: string | undefined;
        onReportBtnPressed: (joinedReasons: string) => Promise<void>;
        reportBtnEnabled: boolean;
      },
      "isOpen"
    >,
    options?: OpenModalOptions,
  ) => void;
  closeReportModal: CloseModal;
  onReportBtnPressed: (joinedReasons: string) => Promise<void>;
  reportBtnEnabled: boolean;
  openBlockModal: (
    props: Omit<
      {
        isOpen: boolean;
        onClose: () => void;
        name: string | undefined;
        onBlockBtnPressed: () => Promise<void>;
        blockBtnEnabled: boolean;
      },
      "isOpen"
    >,
    options?: OpenModalOptions,
  ) => void;
  closeBlockModal: CloseModal;
  onBlockBtnPressed: () => Promise<void>;
  blockBtnEnabled: boolean;
}

function OtherProfileScreenHeader({
  userInfo,
  openReportModal,
  closeReportModal,
  onReportBtnPressed,
  reportBtnEnabled,
  openBlockModal,
  closeBlockModal,
  onBlockBtnPressed,
  blockBtnEnabled,
}: OtherProfileScreenHeaderProp) {
  const router = useRouter();
  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color="#aaa" />
          </TouchableOpacity>
        </View>
        <View style={[headerStyle.right, { justifyContent: "center" }]}>
          <TouchableOpacity
            style={[headerStyle.button, ShadowStyle.pill3d]}
            onPress={() =>
              openReportModal({
                onClose: closeReportModal,
                name: userInfo?.name,
                onReportBtnPressed: onReportBtnPressed,
                reportBtnEnabled: reportBtnEnabled,
              })
            }
          >
            <ReportIcon />
          </TouchableOpacity>
          <TouchableOpacity
            style={[headerStyle.button, ShadowStyle.pill3d]}
            onPress={() =>
              openBlockModal({
                onClose: closeBlockModal,
                name: userInfo?.name,
                onBlockBtnPressed: onBlockBtnPressed,
                blockBtnEnabled: blockBtnEnabled,
              })
            }
          >
            <BlockIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function ErrorOtherProfileScreenHeader() {
  const router = useRouter();

  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 80, // Moved everything down
    paddingBottom: 40,
  },

  avatarContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  avatarImage: {
    width: 100,
    height: 100,
    backgroundColor: "#f8f8fa",
  },

  // Name Tag
  nameTag: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginBottom: 40,
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },

  // Status Box
  statusBox: {
    width: "75%", // Fixed width relative to screen
    borderRadius: 40,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
    backgroundColor: "#f8f8fa",
  },
  statusText: {
    color: "#8F8F9A",
    fontSize: 14,
  },

  // --- BUTTONS ---
  // Container keeps the layout width stable
  actionButtonContainer: {
    width: "75%",
    height: 80,
    justifyContent: "center",
    flexDirection: "row",
  },

  // Double Buttons (Split container)
  doubleButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 12, // Space between buttons
  },
});
