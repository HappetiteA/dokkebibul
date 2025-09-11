import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IModal {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: IModal) {
  if (!isOpen) {
    return;
  }

  return (
    <View style={styles.modal_overlay}>
      <View style={styles.modal_container}>
        <TouchableOpacity onPress={onClose}>
          <Text>CLOSE</Text>
        </TouchableOpacity>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modal_overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(56,56,56,0.43)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal_container: {
    width: 300,
    height: "auto",
    backgroundColor: "white",
    padding: 10,
  },
});
