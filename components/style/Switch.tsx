import React, { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ShadowStyle } from "@/components/style/Shadow";

type NeumorphicSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;

  width?: number;
  height?: number;
  padding?: number;

  onColor?: string;
  offColor?: string;
  thumbColor?: string;

  disabled?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;

  renderThumbContent?: (args: {
    value: boolean;
    size: number;
  }) => React.ReactNode;
};

export function NeumorphicSwitch({
  value,
  onValueChange,

  width = 120,
  height = 64,
  padding = 10,

  onColor = "#93D7EA",
  offColor = "#D7D7E2",
  thumbColor = "#FFFFFF",

  disabled = false,
  style,
  testID,

  renderThumbContent,
}: NeumorphicSwitchProps) {
  const border = Math.round(height * 0.06);

  const innerWidth = width - border * 2;
  const innerHeight = height - border * 2;
  const radius = innerHeight / 2;

  const thumbSize = innerHeight - padding * 2;
  const travel = innerWidth - padding * 2 - thumbSize;

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value]);

  const trackBg = value ? onColor : offColor;

  const thumbTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  const thumbStyle: ViewStyle = useMemo(
    () => ({
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbSize / 2,
      backgroundColor: thumbColor,
      alignItems: "center",
      justifyContent: "center",
      ...(Platform.OS === "android"
        ? { elevation: 10 }
        : {
            shadowColor: "#000",
            shadowOffset: { width: 6, height: 8 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
          }),
    }),
    [thumbSize, thumbColor],
  );

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[{ opacity: disabled ? 0.55 : 1 }, style]}
      hitSlop={10}
    >
      {/* white border */}
      <View
        style={[
          ShadowStyle.default,
          styles.outerRing,
          {
            width,
            height,
            borderRadius: height / 2,
            padding: border,
          },
        ]}
      >
        {/* track */}
        <View
          style={{
            width: innerWidth,
            height: innerHeight,
            borderRadius: radius,
            backgroundColor: trackBg,
          }}
        >
          {/* thumb */}
          <Animated.View
            style={[
              styles.thumbWrapper,
              {
                left: padding,
                top: padding,
                transform: [{ translateX: thumbTranslateX }],
              },
            ]}
          >
            <View style={thumbStyle}>
              {renderThumbContent
                ? renderThumbContent({ value, size: thumbSize })
                : null}
            </View>
          </Animated.View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outerRing: {
    backgroundColor: "#FFFFFF",
  },
  thumbWrapper: {
    position: "absolute",
  },
});
