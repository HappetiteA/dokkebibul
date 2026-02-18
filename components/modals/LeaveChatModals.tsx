import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { ModalStyles } from "./ModalStyles";

export function LeaveChatModal({
  isOpen,
  onClose,
  onLeaveChatBtnPressed,
  leaveChatBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  onLeaveChatBtnPressed: () => Promise<void>;
  leaveChatBtnEnabled: boolean;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>채팅방을 나가시겠습니까?</Text>

          <View style={ModalStyles.modalBtnRow}>
            <TouchableOpacity
              onPress={onLeaveChatBtnPressed}
              disabled={!leaveChatBtnEnabled}
              style={[
                ModalStyles.baseButton,
                ModalStyles.blueButton,
                !leaveChatBtnEnabled && ModalStyles.disabledButton,
              ]}
            >
              <Text style={ModalStyles.buttonText}>나가기</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
            >
              <Text style={ModalStyles.buttonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function LeaveChatSuccessModal({
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>채팅방을 나갔습니다.</Text>
          <TouchableOpacity
            onPress={onClose}
            style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
          >
            <Text style={ModalStyles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export function LeaveChatFailModal({
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            알 수 없는 오류가{"\n"}발생했습니다.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
          >
            <Text style={ModalStyles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
