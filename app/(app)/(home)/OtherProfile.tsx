import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Button,
  Modal,
  Image,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getProfileById, getFollowings } from "@/services/supabase";
import useModal from "@/hooks/useModal";
import { useAuth } from "@/contexts/AuthContext";
import { Profile } from "@/types/model.types";
import { Ionicons } from "@expo/vector-icons";

function BlockModal({
  isOpen,
  onClose,
  name,
  onBlockBtnPressed,
  blockBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
  onBlockBtnPressed: () => Promise<void>;
  blockBtnEnabled: boolean;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 차단하시겠습니까?</Text>
          <View style={styles.modalBtnRow}>
            <Button
              title="차단"
              onPress={onBlockBtnPressed}
              disabled={!blockBtnEnabled}
              color="#FF6B6B"
            />
            <Button title="취소" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function BlockSuccessModal({
  isOpen,
  onClose,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 차단했습니다.</Text>
          <Button title="확인" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function BlockFailModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            알 수 없는 오류로 차단에 실패했습니다. 잠시 후에 다시 시도해주세요.
          </Text>
          <Button title="확인" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const reportReasons = ["음담패설", "못생김", "짜증나게 함", "패드립 함"];

function ReportModal({
  isOpen,
  onClose,
  name,
  onReportBtnPressed,
  reportBtnEnabled,
  reasons,
  setReasons,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
  onReportBtnPressed: () => Promise<void>;
  reportBtnEnabled: boolean;
  reasons: Record<string, boolean>;
  setReasons: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}) {
  const toggleReason = (reason: string) => {
    setReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 신고하시겠습니까?</Text>
          <View style={{ marginBottom: 10 }}>
            {reportReasons.map((reason) => (
              <View key={reason} style={{ marginVertical: 2 }}>
                <Button
                  title={reason + (reasons[reason] ? " (V)" : "")}
                  onPress={() => toggleReason(reason)}
                  color={reasons[reason] ? "#FF6B6B" : "#888"}
                  disabled={!reportBtnEnabled}
                />
              </View>
            ))}
          </View>
          <View style={styles.modalBtnRow}>
            <Button
              title="신고하기"
              onPress={onReportBtnPressed}
              disabled={!reportBtnEnabled}
              color="#FF6B6B"
            />
            <Button title="취소" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ReportSuccessModal({
  isOpen,
  onClose,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 신고했습니다.</Text>
          <Button title="확인" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

function ReportFailModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            알 수 없는 오류로 신고에 실패했습니다. 잠시 후에 다시 시도해주세요.
          </Text>
          <Button title="확인" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

// --- MAIN SCREEN ---

export default function OtherProfileScreen() {
  const router = useRouter();
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
  const defaultReasons = Object.fromEntries(
    reportReasons.map((r) => [r, false])
  );
  const [reasons, setReasons] =
    useState<Record<string, boolean>>(defaultReasons);

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
          router.navigate("/(app)/(home)");
          closeBlockSuccessModal();
        },
        name: userInfo?.name,
      });
    }
  };

  const onReportBtnPressed = async () => {
    setReportBtnEnabled(false);

    if (!profile) {
      setReportBtnEnabled(true);
      return;
    }

    const selectedReasons = Object.keys(reasons).filter((r) => reasons[r]);
    const joinedReasons = selectedReasons.join(", ");

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
    router.navigate({ pathname: "/chat/[id]", params: { id: user_id } });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <OtherProfileScreenHeader />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Avatar Section - Transparent, No Border, No Shadow */}
        <View style={styles.avatarContainer}>
          <Image
            source={require("@/assets/from_figma/icon-wisp-list.png")}
            style={styles.avatarImage}
            resizeMode="contain"
          />
        </View>

        {/* Name Tag - With Shadow */}
        <View style={[styles.commonShadow, styles.nameTag]}>
          <Text style={styles.nameText}>{userInfo?.name ?? "김뿁뿁"}</Text>
        </View>

        {/* Status Message Box - With Shadow */}
        <View style={[styles.commonShadow, styles.statusBox]}>
          <Text style={styles.statusText}>상태 메시지 상태 메시지</Text>
        </View>

        {/* Action Buttons Container - Fixed Width */}
        <View style={styles.actionButtonContainer}>
          {!follow ? (
            // State 1: Single Button
            <TouchableOpacity
              style={[
                styles.buttonBase,
                styles.commonShadow,
                styles.followButtonWide,
              ]}
              onPress={onFollowBtnPressed}
              disabled={!followBtnEnabled}
            >
              <Text style={styles.followButtonText}>팔로우</Text>
            </TouchableOpacity>
          ) : (
            // State 2: Two Buttons
            <View style={styles.doubleButtonRow}>
              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  styles.commonShadow,
                  styles.unfollowButton,
                ]}
                onPress={onFollowBtnPressed}
                disabled={!followBtnEnabled}
              >
                <Text style={styles.unfollowButtonText}>팔로우 취소</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonBase,
                  styles.commonShadow,
                  styles.chatButton,
                ]}
                onPress={onChatBtnPressed}
              >
                <Text style={styles.chatButtonText}>대화하기</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.footerOptions}>
          <TouchableOpacity
            onPress={() =>
              openReportModal({
                onClose: closeReportModal,
                name: userInfo?.name,
                onReportBtnPressed: onReportBtnPressed,
                reportBtnEnabled: reportBtnEnabled,
                reasons: reasons,
                setReasons: setReasons,
              })
            }
          >
            <Text style={styles.footerLinkText}>신고하기</Text>
          </TouchableOpacity>
          <Text style={styles.footerDivider}>|</Text>
          <TouchableOpacity
            onPress={() =>
              openBlockModal({
                onClose: closeBlockModal,
                name: userInfo?.name,
                onBlockBtnPressed: onBlockBtnPressed,
                blockBtnEnabled: blockBtnEnabled,
              })
            }
          >
            <Text style={styles.footerLinkText}>차단하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function OtherProfileScreenHeader() {
  const router = useRouter();
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#aaa" />
      </TouchableOpacity>
    </View>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  headerContainer: {
    height: 50,
    paddingHorizontal: 16,
    justifyContent: "center",
    zIndex: 10,
  },
  backButton: {
    padding: 8,
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 80, // Moved everything down
    paddingBottom: 40,
  },

  // --- REUSABLE SHADOW STYLE ---
  commonShadow: {
    backgroundColor: "#ffffff", // Needed for shadow to be visible
    shadowColor: "#000",
    shadowOffset: { width: 7, height: 7 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Avatar (Transparent, No Shadow)
  avatarContainer: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  avatarImage: {
    width: 100,
    height: 100,
    // Removed borderRadius to ensure no clipping if the image is irregular
    // If you want a circle crop, keep borderRadius: 50
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
    width: "85%", // Fixed width relative to screen
    borderRadius: 24,
    paddingVertical: 50,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 60,
  },
  statusText: {
    color: "#888",
    fontSize: 14,
  },

  // --- BUTTONS ---
  // Container keeps the layout width stable
  actionButtonContainer: {
    width: "85%", // Same width as status box
    height: 50, // Fixed height so buttons don't jump in size
    marginBottom: 40,
    justifyContent: "center",
  },
  buttonBase: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%", // Fill container height
    borderRadius: 30,
  },

  followButtonWide: {
    width: "50%",
    alignSelf: "center",
    backgroundColor: "#ffffff",
  },
  followButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },

  // Double Buttons (Split container)
  doubleButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: "100%",
    gap: 12, // Space between buttons
  },
  unfollowButton: {
    flex: 1, // Takes 50% - gap
    backgroundColor: "#E6E6E6",
  },
  unfollowButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  chatButton: {
    flex: 1, // Takes 50% - gap
    backgroundColor: "#AEE4FF",
  },
  chatButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },

  // Footer
  footerOptions: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerLinkText: {
    fontSize: 13,
    color: "#999",
    padding: 8,
  },
  footerDivider: {
    color: "#ddd",
    marginHorizontal: 4,
  },

  // Modal styles...
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: "center",
  },
  modalText: { marginBottom: 20 },
  modalBtnRow: { flexDirection: "row", gap: 10 },
});
