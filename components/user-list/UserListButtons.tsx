import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ActionButtonProps {
  text: string;
  onPress: () => void;
  variant?: "chat" | "followBack"; // 'chat' is gray/white, 'followBack' is blue
}

export function ListActionButton({ text, onPress, variant = "chat" }: ActionButtonProps) {
  const isChat = variant === "chat";
  
  return (
    <TouchableOpacity
      style={[styles.baseButton, isChat ? styles.chatBtn : styles.followBackBtn]}
      onPress={onPress}
    >
      <Text style={[styles.baseText, isChat ? styles.chatText : styles.followBackText]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

export function UnblockCircleButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.unblockButtonCircle} onPress={onPress}>
      <View style={styles.minusSign} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // --- Pill Buttons ---
  baseButton: {
    borderWidth: 2,
    borderRadius: 20,
    paddingTop: 7, // Adjusting centering based on your original code
    alignItems: "center",
    height: 32,
    width: 85,
  },
  baseText: {
    fontSize: 15,
    fontWeight: "600", // Unified weight slightly
  },
  
  // Chat Variant
  chatBtn: {
    borderColor: "#D9D9D9",
    backgroundColor: "#f8f8fa",
  },
  chatText: {
    color: "#535361",
    fontWeight: "500",
  },

  // Follow Back Variant
  followBackBtn: {
    borderColor: "#99D8EE",
    backgroundColor: "#99D8EE",
  },
  followBackText: {
    color: "#000000",
    fontWeight: "600",
  },

  // --- Unblock Circle ---
  unblockButtonCircle: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#D7D7E2",
    justifyContent: "center",
    alignItems: "center",
  },
  minusSign: {
    width: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ffffff",
  },
});
