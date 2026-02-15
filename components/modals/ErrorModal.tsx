import { Modal, View, Text, TouchableOpacity } from "react-native";
import { ModalStyles } from "./ModalStyles";

export function ErrorModal({
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
            오류가 발생했습니다.
          </Text>

          <Text style={ModalStyles.detailsText}>
            잠시 후 다시 시도해주세요.
          </Text>

          {/* Button Group */}
          <View style={ModalStyles.buttonContainer}>
            <TouchableOpacity
              style={[ModalStyles.baseButton, ModalStyles.blueButton]}
              onPress={onClose}
            >
              <Text style={ModalStyles.buttonText}>확인</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
