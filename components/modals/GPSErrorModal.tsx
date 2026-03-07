import { Modal, View, TouchableOpacity, StyleSheet } from "react-native";
import { ModalStyles } from "./ModalStyles";
import { Text } from "@/components/Text";

export function GPSErrorModal({
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
          <Text style={ModalStyles.titleText}>
            위치 정보 수집에{"\n"}실패했습니다.
          </Text>

          <Text style={ModalStyles.detailsText}>
            GPS 권한 설정을 확인해주세요
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
