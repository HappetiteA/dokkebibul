import { StyleSheet } from "react-native";

export const ShadowStyle = StyleSheet.create({
  pill3d: {
    boxShadow:
      "-3px -4px 3px 0px rgba(255, 255, 255, 0.6), 3px 5px 6px 0px rgba(0, 0, 0, 0.15)",
    backgroundColor: "F8F8FA",
  },
  default: {
    boxShadow: "3px 5px 6px 0px rgba(0, 0, 0, 0.15)",
  },
});
