import { StyleSheet, Text, TouchableOpacity, View, Button, Modal } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import headerStyle from "@/components/style/headerStyle";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/utils/supabase";
import { getProfileById, getFollowings } from "@/hooks/data";
import useModal from "@/hooks/useModal";
import { useAuth } from "@/utils/AuthContext";
import { Profile } from "@/utils/global.types";


function BlockModal({ isOpen, onClose, name, onBlockBtnPressed, blockBtnEnabled }: { isOpen: boolean; onClose: () => void; name: string | undefined, onBlockBtnPressed: () => Promise<void>, blockBtnEnabled: boolean }) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 차단하시겠습니까?</Text>
          <>
            <Button title="차단" onPress={onBlockBtnPressed} disabled={!blockBtnEnabled} />
            <Button title="취소" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  );
}

function BlockSuccessModal({ isOpen, onClose, name }: { isOpen: boolean; onClose: () => void; name: string | undefined}) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 차단했습니다.</Text>
          <>
            <Button title="확인" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  )
}

function BlockFailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>알 수 없는 오류로 차단에 실패했습니다. 잠시 후에 다시 시도해주세요.</Text>
          <>
            <Button title="확인" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  )
}


const reportReasons = ["음담패설", "못생김", "짜증나게 함", "패드립 함"];

function ReportModal({ isOpen, onClose, name, onReportBtnPressed, reportBtnEnabled, reasons, setReasons }: { isOpen: boolean; onClose: () => void; name: string | undefined, onReportBtnPressed: () => Promise<void>, reportBtnEnabled: boolean, reasons: Record<string, boolean>; setReasons: React.Dispatch<React.SetStateAction<Record<string, boolean>>> }) {
  const toggleReason = (reason: string) => {
    setReasons(prev => ({
      ...prev,
      [reason]: !prev[reason],
    }));
  };

  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 신고하시겠습니까?</Text>
          <>
            {reportReasons.map(reason => 
              <Button key={reason} title={reason} onPress={() => {toggleReason(reason)}} disabled={!reportBtnEnabled} />
            )}
          </>
          <>
            <Button title="신고하기" onPress={onReportBtnPressed} disabled={!reportBtnEnabled} />
            <Button title="취소" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  );
}

function ReportSuccessModal({ isOpen, onClose, name }: { isOpen: boolean; onClose: () => void; name: string | undefined}) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>{name} 님을 신고했습니다.</Text>
          <>
            <Button title="확인" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  )
}

function ReportFailModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void; }) {
  return (
    <Modal visible={isOpen} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>알 수 없는 오류로 신고에 실패했습니다. 잠시 후에 다시 시도해주세요.</Text>
          <>
            <Button title="확인" onPress={onClose} />
          </>
        </View>
      </View>
    </Modal>
  )
}

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
  const { open: openBlockSuccessModal, close: closeBlockSuccessModal } = useModal(BlockSuccessModal);
  const { open: openBlockFailModal, close: closeBlockFailModal } = useModal(BlockFailModal);

  const [reportBtnEnabled, setReportBtnEnabled] = useState(true);
  const { open: openReportModal, close: closeReportModal } = useModal(ReportModal);
  const { open: openReportSuccessModal, close: closeReportSuccessModal } = useModal(ReportSuccessModal);
  const { open: openReportFailModal, close: closeReportFailModal } = useModal(ReportFailModal);
  const defaultReasons = Object.fromEntries(reportReasons.map(r => [r, false]));
  const [reasons, setReasons] = useState<Record<string, boolean>>(defaultReasons);

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
      openBlockSuccessModal({ onClose: () => {router.navigate("/(app)/(home)"); closeBlockSuccessModal();}, name: userInfo?.name });
    }
  };

  const onReportBtnPressed = async () => {
    setReportBtnEnabled(false);

    if (!profile) {
      setReportBtnEnabled(true);
      return;
    }

    const selectedReasons = Object.keys(reasons).filter(r => reasons[r]);
    const joinedReasons = selectedReasons.join(", ");

    const { error } = await supabase
      .from("reports")
      .insert({ src_id: profile.user_id, dst_id: user_id, reason: joinedReasons });

    closeReportModal();
    setReportBtnEnabled(true);
    if (error) {
      console.error(error);
      openReportFailModal({ onClose: closeReportFailModal });
    } else {
      openReportSuccessModal({ onClose: () => {closeReportSuccessModal();}, name: userInfo?.name });
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
    <View>
      <OtherProfileScreenHeader />
      <View>
        <Text>{userInfo?.name}</Text>
        <Text>Location</Text>
        <Text>Description</Text>
        <Text>Account Info</Text>

        <View style={styles.horizontalBtn}>
          <TouchableOpacity
            onPress={onFollowBtnPressed}
            disabled={!followBtnEnabled}
          >
            <Text>{follow ? "팔로우 취소" : "팔로우"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onChatBtnPressed} disabled={!follow}>
            <Text>대화하기</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => openReportModal({ onClose: closeReportModal, name: userInfo?.name, onReportBtnPressed: onReportBtnPressed, reportBtnEnabled: reportBtnEnabled, reasons: reasons, setReasons: setReasons })}>
          <Text>신고하기</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openBlockModal({ onClose: closeBlockModal, name: userInfo?.name, onBlockBtnPressed: onBlockBtnPressed, blockBtnEnabled: blockBtnEnabled })}>
          <Text>차단하기</Text>
        </TouchableOpacity>
      </View>

      {/* <ModalChain
        ref={blockModalChainRef}
        modals={[
          {
            children: (
              <View>
                <Text>{userInfo?.name}님을 차단하시겠습니까?</Text>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.close}
                >
                  <Text>취소</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.goNext}
                >
                  <Text>차단하기</Text>
                </TouchableOpacity>
              </View>
            ),
          },
          {
            children: (
              <View>
                <Text>{userInfo?.name}님을 차단했습니다</Text>
                <TouchableOpacity onPressOut={blockModalChainRef.current?.close}>
                <TouchableOpacity
                  onPressOut={blockModalChainRef.current?.goNext}
                >
                  <Text>확인</Text>
                </TouchableOpacity>
              </View>
            ),
          },
        ]}
      /> */}
    </View>
  );
}

function OtherProfileScreenHeader() {
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
          <TouchableOpacity style={headerStyle.button} onPress={onPressBackBtn}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  horizontalBtn: {
    flexDirection: "row",
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    minWidth: 300,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
});
