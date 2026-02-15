import { Text, TouchableOpacity, View, Modal } from "react-native";
import { useState, useEffect } from "react";
import { ModalStyles } from "./ModalStyles";

const reportReasons = ["혐오표현", "범죄", "성희롱", "폭언, 욕설", "괴롭힘"];

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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            {name ? name + "님을" : "이 사용자를"}
            {"\n"}신고하시겠습니까?
          </Text>

          {/* Reason List */}
          <View style={ModalStyles.reasonListContainer}>
            {reportReasons.map((reason) => {
              const isSelected = reasons[reason];
              return (
                <TouchableOpacity
                  key={reason}
                  onPress={() => toggleReason(reason)}
                  activeOpacity={0.7}
                  style={[
                    ModalStyles.reasonButton,
                    isSelected && ModalStyles.reasonButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      ModalStyles.reasonText,
                      isSelected && ModalStyles.reasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Action Buttons */}
          <View style={ModalStyles.modalBtnRow}>
            <TouchableOpacity
              onPress={handleReport}
              disabled={!isAnyReasonSelected || !reportBtnEnabled}
              style={[
                ModalStyles.baseButton,
                isAnyReasonSelected
                  ? ModalStyles.blueButton
                  : ModalStyles.disabledButton,
              ]}
            >
              <Text style={ModalStyles.buttonText}>신고하기</Text>
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            {name ? name + "님을" : "이 사용자를"}
            {"\n"}신고했습니다.
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
      <View style={ModalStyles.modalOverlay}>
        <View style={ModalStyles.modalContent}>
          <Text style={ModalStyles.modalText}>
            알 수 없는 오류로{"\n"}신고에 실패했습니다.
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
