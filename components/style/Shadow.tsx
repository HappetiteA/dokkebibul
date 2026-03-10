import { StyleSheet } from "react-native";

export const ShadowStyle = StyleSheet.create({
  pill3d: {
    boxShadow:
      "-3px -4px 3px 0px rgba(255, 255, 255, 0.6), 3px 5px 6px 0px rgba(0, 0, 0, 0.15)",
  },
  pill3dSwitch: {
    boxShadow:
      "-2px -1px 2px 0px rgba(255, 255, 255, 0.6), 2px 2px 2px 0px rgba(0, 0, 0, 0.15)",
  },
  default: {
    boxShadow: "3px 5px 6px 0px rgba(0, 0, 0, 0.15)",
  },
});
