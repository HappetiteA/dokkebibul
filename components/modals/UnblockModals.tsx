import { TouchableOpacity, View, Modal } from "react-native";
import { ModalStyles } from "./ModalStyles";
import { Text } from "@/components/Text";

export function UnblockModal({
  isOpen,
  onClose,
  name,
  onUnblockBtnPressed,
  unblockBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
  onUnblockBtnPressed: () => Promise<void>;
  unblockBtnEnabled: boolean;
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
            {name ? name + "님" : "이 사용자의"}
            {"\n"}차단을 취소하시겠습니까?
          </Text>

          <View style={ModalStyles.modalBtnRow}>
            <TouchableOpacity
              onPress={onUnblockBtnPressed}
              disabled={!unblockBtnEnabled}
              style={[
                ModalStyles.baseButton,
                ModalStyles.blueButton,
                !unblockBtnEnabled && ModalStyles.disabledButton,
              ]}
            >
              <Text style={ModalStyles.buttonText}>네</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
            >
              <Text style={ModalStyles.buttonText}>아니오</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- 2. SUCCESS MODAL ---
export function UnblockSuccessModal({
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            {name ? name + "님" : "이 사용자의"}
            {"\n"}차단을 취소했습니다.
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

// --- 3. FAIL MODAL ---
export function UnblockFailModal({
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
