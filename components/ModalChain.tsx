import React, { useState, useImperativeHandle, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";

type ModalData = {
  children: React.ReactNode;
};

type ModalChainProps = {
  ref: React.RefObject<ModalChainRef | null>;
  modals: ModalData[];
};

export type ModalChainRef = {
  close: () => void;
  open: () => void;
  goNext: () => void;
  setDisabled: (disabled: boolean) => void;
};

const ANIMATION_DURATION = 500;

function ModalChain({ ref, modals }: ModalChainProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const reopenTimer = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    close: () => {
      setVisible(false);
    },
    open: () => {
      setCurrentIndex(0);
      setVisible(true);
    },
    goNext: () => {
      if (currentIndex < modals.length - 1) {
        setVisible(false);
        if (reopenTimer.current) clearTimeout(reopenTimer.current);

        reopenTimer.current = setTimeout(() => {
          setCurrentIndex((prev) => prev + 1);
          setVisible(true);
        }, ANIMATION_DURATION);
      } else {
        setVisible(false)
      }
    },
    setDisabled: (d: boolean) => setDisabled(d),
  }));

  useEffect(() => {
    return () => {
      if (reopenTimer.current) clearTimeout(reopenTimer.current);
    };
  }, []);

  useEffect(() => {
    console.log(currentIndex)
  }, [currentIndex])

  const currentModalData = modals!==undefined ? modals[currentIndex] : undefined;

  return (
    <View>
      <Modal
        visible={visible}
        onRequestClose={() => setVisible(false)}
        transparent
        animationType="fade"
      >
        <TouchableWithoutFeedback
          onPress={() => !disabled && setVisible(false)}
        >
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>

        <View style={styles.centeredView}>
          <View style={styles.modalBox}>
            {currentModalData!==undefined ? currentModalData.children : null}

            {disabled && (
              <View style={styles.disabledOverlay}>
                <ActivityIndicator size="large" color="#666" />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  centeredView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    minWidth: "70%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  disabledOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.6)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
});

export default ModalChain;
