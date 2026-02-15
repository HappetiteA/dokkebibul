import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ModalStyles } from "./ModalStyles";

export function DetailsModal({
  isOpen,
  onClose,
  name,
  onLeaveChat,
  onBlock,
  onReport,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string; // The name to display
  onLeaveChat: () => void;
  onBlock: () => void;
  onReport: () => void;
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
          {/* Close Icon (Top Right) */}
          <TouchableOpacity
            style={ModalStyles.closeButtonWrapper}
            onPress={onClose}
          >
            <Ionicons name="close" size={30} color="#C4C4C4" />
          </TouchableOpacity>

          {/* Username Title */}
          <Text style={ModalStyles.usernameText}>{name}</Text>

          {/* Button Group */}
          <View style={ModalStyles.buttonContainer}>
            {/* Top Button: Leave Chat */}
            <TouchableOpacity
              style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
              onPress={onLeaveChat}
            >
              <Text style={ModalStyles.buttonText}>채팅방 나가기</Text>
            </TouchableOpacity>

            {/* Bottom Row: Block & Report */}
            <View style={ModalStyles.bottomRow}>
              <TouchableOpacity
                style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
                onPress={onBlock}
              >
                <Text style={ModalStyles.buttonText}>차단하기</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[ModalStyles.baseButton, ModalStyles.whiteButton]}
                onPress={onReport}
              >
                <Text style={ModalStyles.buttonText}>신고하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
