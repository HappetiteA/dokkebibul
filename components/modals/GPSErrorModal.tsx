import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Username Title */}
          <Text style={styles.titleText}>
            위치 정보 수집에{"\n"}실패했습니다.
          </Text>

          <Text style={styles.detailsText}>
            GPS 권한 설정을 확인해주세요
          </Text>

          {/* Button Group */}
          <View style={styles.buttonContainer}>
            {/* Top Button: Leave Chat */}
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.buttonText}>취소</Text>
            </TouchableOpacity>
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
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginVertical: 20,
    textAlign: "center",
  },
  detailsText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#909090",
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
