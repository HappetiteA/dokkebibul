import { StyleSheet, Text, TouchableOpacity, View, Modal } from "react-native";
import { useState, useEffect } from "react";

const reportReasons = ["음담패설", "못생김", "짜증나게 함", "패드립 함"];

// --- 1. REPORT MODAL ---
export function ReportModal({
  isOpen,
  onClose,
  name,
  onReportBtnPressed, // logic to run when report is confirmed
  reportBtnEnabled,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
  onReportBtnPressed: (joinedReasons: string) => Promise<void>; // Updated signature
  reportBtnEnabled: boolean;
}) {
  // INTERNAL STATE: The modal manages the checkboxes itself now.
  const [reasons, setReasons] = useState<Record<string, boolean>>({});

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, boolean> = {};
      reportReasons.forEach((r) => (initial[r] = false));
      setReasons(initial);
    }
  }, [isOpen]);

  const toggleReason = (reason: string) => {
    setReasons((prev) => ({
      ...prev,
      [reason]: !prev[reason], // Toggles immediately
    }));
  };

  const handleReport = () => {
    // 1. Gather selected reasons
    const selected = Object.keys(reasons).filter((key) => reasons[key]);
    const joinedReasons = selected.join(", ");

    // 2. Pass them back to the parent
    onReportBtnPressed(joinedReasons);
  };

  // Calculate if button should be enabled (at least one reason selected)
  const isAnyReasonSelected = Object.values(reasons).some((val) => val);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {name ? name + "님을" : "이 사용자를"}{"\n"}신고하시겠습니까?
          </Text>

          {/* Reason List */}
          <View style={styles.reasonListContainer}>
            {reportReasons.map((reason) => {
              const isSelected = reasons[reason];
              return (
                <TouchableOpacity
                  key={reason}
                  onPress={() => toggleReason(reason)}
                  activeOpacity={0.7}
                  style={[
                    styles.reasonButton,
                    isSelected && styles.reasonButtonSelected, // Green bg
                  ]}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      isSelected && styles.reasonTextSelected, // White text
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={styles.modalBtnRow}>
            <TouchableOpacity
              onPress={handleReport}
              disabled={!isAnyReasonSelected || !reportBtnEnabled}
              style={[
                styles.baseButton,
                isAnyReasonSelected ? styles.blueButton : styles.disabledButton,
              ]}
            >
              <Text style={styles.blueButtonText}>신고</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.baseButton, styles.whiteButton]}
            >
              <Text style={styles.whiteButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// --- 2. SUCCESS MODAL ---
export function ReportSuccessModal({
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
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalText}>
            {name ? name + "님을" : "이 사용자를"}{"\n"}신고했습니다.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.baseButton, styles.whiteButton]}
          >
            <Text style={styles.whiteButtonText}>확인</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// --- 3. FAIL MODAL ---
export function ReportFailModal({
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
          <Text style={styles.modalText}>
            알 수 없는 오류로{"\n"}신고에 실패했습니다.
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.baseButton, styles.whiteButton]}
          >
            <Text style={styles.whiteButtonText}>확인</Text>
          </TouchableOpacity>
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
    paddingVertical: 35,
    paddingHorizontal: 30,
    borderRadius: 20, // Rounded container
    width: 300,
    alignItems: "center",

    // Shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 25,
    fontSize: 16, // Slightly smaller than 20 for better fit
    fontWeight: "600", // Semi-bold
    textAlign: "center",
    lineHeight: 24, // Better spacing for newlines
    color: "#333",
  },
  modalBtnRow: {
    flexDirection: "row",
    gap: 12, // Space between buttons
    justifyContent: "center",
    width: "100%",
  },

  // --- BUTTON STYLES ---
  baseButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20, // Fully rounded pill shape
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },

  // Blue Filled Button (For "Block" or primary actions)
  blueButton: {
    backgroundColor: "#89CFF0", // The light blue from your image
    borderWidth: 0,
  },
  blueButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },

  // White Bordered Button (For "Cancel" or "Confirm")
  whiteButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#E0E0E0", // Light grey border
  },
  whiteButtonText: {
    color: "#555555", // Grey text
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    backgroundColor: "#E0E0E0", // Grayed out if nothing selected
  },

  // --- REASON BUTTON STYLES ---
  reasonListContainer: {
    width: "100%",
    marginBottom: 20,
  },
  reasonButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 12, // Slightly squared corners for list items
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginBottom: 8,
  },
  reasonButtonSelected: {
    backgroundColor: "#4CD964", // Green toggle color
    borderColor: "#4CD964",
  },
  reasonText: {
    fontSize: 14,
    color: "#555",
    fontWeight: "500",
  },
  reasonTextSelected: {
    color: "#ffffff", // White text when selected
    fontWeight: "600",
  },
});

