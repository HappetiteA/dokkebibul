import { Text, TouchableOpacity, View, Modal } from "react-native";
import { ModalStyles } from "./ModalStyles";

// --- 1. BLOCK CONFIRMATION MODAL ---
export function BlockModal({
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            {name ? name + "님을" : "이 사용자를"}
            {"\n"}차단하시겠습니까?
          </Text>

          <View style={ModalStyles.modalBtnRow}>
            {/* Left: Blue "Block" Button */}
            <TouchableOpacity
              onPress={onBlockBtnPressed}
              disabled={!blockBtnEnabled}
              style={[
                ModalStyles.baseButton,
                ModalStyles.blueButton,
                !blockBtnEnabled && ModalStyles.disabledButton,
              ]}
            >
              <Text style={ModalStyles.buttonText}>차단</Text>
            </TouchableOpacity>

            {/* Right: White "Cancel" Button */}
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

// --- 2. SUCCESS MODAL ---
export function BlockSuccessModal({
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
            {name ? name + "님을" : "이 사용자를"}
            {"\n"}차단했습니다.
          </Text>

          {/* Single White "Confirm" Button */}
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
export function BlockFailModal({
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
            알 수 없는 오류로{"\n"}차단에 실패했습니다.
          </Text>

          {/* Single White "Confirm" Button */}
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
