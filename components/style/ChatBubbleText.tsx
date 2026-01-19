import React from "react";
import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";

type ChatBubbleProps = {
  text: string;

  width?: number | string;
  height?: number;

  bubbleColor?: string;

  radius?: number;
  tailSize?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
};

export default function ChatBubbleText({
  text,

  bubbleColor = "#E9E9EF",

  radius = 22,
  tailSize = 18,
  paddingHorizontal = 18,
  paddingVertical = 10,
}: ChatBubbleProps) {
  const tailVisualHeight = tailSize / 2;

  return (
    <View style={{ position: "absolute", bottom: "70%", maxWidth: 300 }}>
      <View
        style={[
          styles.bubble,
          {
            backgroundColor: bubbleColor,
            borderRadius: radius,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              paddingHorizontal,
              paddingVertical,
            },
          ]}
        >
          {text}
        </Text>

        <View
          pointerEvents="none"
          style={[
            styles.tail,
            {
              width: tailSize,
              height: tailSize,
              backgroundColor: bubbleColor,
              left: "50%",
              marginLeft: -tailSize / 2,
              bottom: -tailVisualHeight,
              borderRadius: Math.max(2, radius * 0.15),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    position: "relative",
    overflow: "visible",
  },
  text: {
    flexShrink: 1,
    fontSize: 24,
    lineHeight: 28,
  },
  tail: {
    position: "absolute",
    transform: [{ rotate: "45deg" }],
  },
});
