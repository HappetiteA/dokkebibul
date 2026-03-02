import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";
import { ShadowStyle } from "@/components/style/Shadow";

export type PillButtonVariant = "blue" | "gray" | "white";

interface PillButtonProps {
  text: string;
  onPress: () => void;
  variant?: PillButtonVariant;
  width?: DimensionValue;
  height?: DimensionValue;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean
}

export function PillButton({
  text,
  onPress,
  variant = "white",
  width,
  height = 41, // Default height
  containerStyle,
  textStyle,
  disabled,
}: PillButtonProps) {
  // Dynamic Styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "blue":
        return {
          bg: "#99D8EE",
          text: "#000000",
        };
      case "gray":
        return {
          bg: "#D7D7E2",
          text: "#000000",
        };
      case "white":
      default:
        return {
          bg: "#F8F9FA",
          text: "#000000",
        };
    }
  };

  const colors = getVariantStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.container,
        ShadowStyle.pill3d, // Apply your 3D Shadow
        {
          backgroundColor: colors.bg,
          width: width,
          height: height,
        },
        containerStyle,
      ]}
      disabled={disabled}
    >
      <Text style={[styles.text, { color: colors.text }, textStyle]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 30, // High radius for pill shape
    borderWidth: 3, // Thickness of the white border
    borderColor: "#f8f8fa", // The White Border mentioned
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
});
