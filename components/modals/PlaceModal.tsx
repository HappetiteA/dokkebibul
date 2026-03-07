import { StyleSheet, TouchableOpacity, View, Modal } from "react-native";
import { ModalStyles } from "./ModalStyles";
import { Text } from "@/components/Text";

export default function PlaceModal({
  isOpen,
  onClose,
  origAddr,
  newAddr,
  onPlaceBtnPressed,
  placeBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  origAddr: string | undefined;
  newAddr: string | undefined;
  onPlaceBtnPressed: () => Promise<void>;
  placeBtnEnabled: boolean;
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
            현 위치에 도깨비불을{"\n"}데려다 놓을까요?
          </Text>
          <Text style={ModalStyles.detailsText}>기존 위치: {origAddr}</Text>
          <Text style={ModalStyles.detailsText}>현 위치: {newAddr}</Text>
          <View style={ModalStyles.modalBtnRow}>
            <TouchableOpacity
              onPress={onPlaceBtnPressed}
              disabled={!placeBtnEnabled}
              style={[ModalStyles.baseButton, ModalStyles.blueButton]}
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

export function PlaceSuccessModal({
  isOpen,
  onClose,
  addr,
}: {
  isOpen: boolean;
  onClose: () => void;
  addr: string;
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
          {/* Username Title */}
          <Text style={ModalStyles.titleText}>
            도깨비불을 현 위치에{"\n"}데려다 놓았습니다
          </Text>

          <Text style={ModalStyles.detailsText}>현 위치: {addr}</Text>

          {/* Button Group */}
          <View style={ModalStyles.buttonContainer}>
            {/* Top Button: Leave Chat */}
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
