import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { Ionicons } from "@expo/vector-icons";


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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Close Icon (Top Right) */}
          <TouchableOpacity style={styles.closeButtonWrapper} onPress={onClose}>
            <Ionicons name="close" size={24} color="#C4C4C4" />
          </TouchableOpacity>

          {/* Username Title */}
          <Text style={styles.usernameText}>{name}</Text>

          {/* Button Group */}
          <View style={styles.buttonContainer}>
            {/* Top Button: Leave Chat */}
            <TouchableOpacity style={styles.actionButton} onPress={onLeaveChat}>
              <Text style={styles.buttonText}>채팅방 나가기</Text>
            </TouchableOpacity>

            {/* Bottom Row: Block & Report */}
            <View style={styles.bottomRow}>
              <TouchableOpacity style={styles.actionButton} onPress={onBlock}>
                <Text style={styles.buttonText}>차단하기</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.actionButton} onPress={onReport}>
                <Text style={styles.buttonText}>신고하기</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // Dark overlay
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    width: 300,
    paddingTop: 15,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderRadius: 25, // Soft rounded corners
    alignItems: "center",

    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  closeButtonWrapper: {
    alignSelf: "flex-end", // Pushes to the right
    padding: 5, // Hit slop area
    marginBottom: 5,
  },
  usernameText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    gap: 12, // Vertical space between "Leave" and bottom row
  },
  bottomRow: {
    flexDirection: "row",
    gap: 12, // Horizontal space between Block and Report
  },

  // --- BUTTON STYLE ---
  actionButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light gray border
    borderRadius: 20, // Pill shape
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 14,
    color: "#555", // Dark gray text
    fontWeight: "500",
  },
});
