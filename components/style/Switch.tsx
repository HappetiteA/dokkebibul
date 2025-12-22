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
import ShadowWrap from "./Shadow";

type NeumorphicSwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;

  width?: number; // 트랙 가로
  height?: number; // 트랙 세로
  padding?: number; // 트랙 내부 여백(thumb와 트랙 사이)

  onColor?: string;
  offColor?: string;
  thumbColor?: string;

  disabled?: boolean;

  style?: StyleProp<ViewStyle>;
  testID?: string;
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
}: NeumorphicSwitchProps) {
  const radius = height / 2;
  const thumbSize = height - padding * 2;
  const travel = width - padding * 2 - thumbSize;

  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: value ? 1 : 0,
      duration: 180,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [value, anim]);

  const trackBg = value ? onColor : offColor;

  const thumbTranslateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, travel],
  });

  // 트랙은 “겉으로 튀어나온” 느낌(outer shadow)
  // 썸은 더 진한 shadow로 둥글고 떠있는 느낌
  // const trackShadow = useMemo(() => {
  //   const common: ViewStyle = {
  //     borderRadius: radius,
  //     backgroundColor: trackBg,
  //   };

  //   if (Platform.OS === "android") {
  //     // Android는 한 개 shadow만 가능 → elevation으로 근사
  //     return [common, styles.androidTrackShadow];
  //   }

  //   // iOS: 두 개의 그림자를 겹쳐 네오모피즘 구현
  //   return [common, styles.iosTrackLightShadow, styles.iosTrackDarkShadow];
  // }, [radius, trackBg]);

  const thumbShadow = useMemo(() => {
    const common: ViewStyle = {
      width: thumbSize,
      height: thumbSize,
      borderRadius: thumbSize / 2,
      backgroundColor: thumbColor,
    };

    if (Platform.OS === "android") {
      return [common, styles.androidThumbShadow];
    }

    return [common, styles.iosThumbShadow];
  }, [thumbSize, thumbColor]);

  return (
    <Pressable
      testID={testID}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[{ opacity: disabled ? 0.55 : 1 }, style]}
      hitSlop={10}
    >
      {/* 트랙 */}
      <View style={[styles.trackBase, { width, height, borderRadius: radius }]}>
        {/* iOS에서 “두 그림자”를 제대로 만들려면 레이어를 2개로 겹치는 게 가장 확실 */}
        {Platform.OS === "ios" ? (
          <>
            <ShadowWrap>
              <View style={styles.inner_shadow}>
                <View
                  style={{
                    width,
                    height,
                    borderRadius: radius,
                    backgroundColor: trackBg,
                  }}
                />
              </View>
            </ShadowWrap>
          </>
        ) : (
          <View
            style={[
              styles.androidTrackShadow,
              { width, height, borderRadius: radius, backgroundColor: trackBg },
            ]}
          />
        )}

        {/* 썸 */}
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
          {/* iOS: thumb는 자체 shadow */}
          <View style={thumbShadow as any} />
        </Animated.View>

        {/* 트랙 내부 “인셋 느낌”을 살짝 주고 싶으면 오버레이(선택) */}
        <View
          pointerEvents="none"
          style={[
            styles.innerSoftOverlay,
            { borderRadius: radius, opacity: value ? 0.18 : 0.22 },
          ]}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  trackBase: {
    position: "relative",
    justifyContent: "center",
  },

  // thumb 위치 래퍼(애니메이션 transform 적용)
  thumbWrapper: {
    position: "absolute",
  },

  inner_shadow: {
    backgroundColor: "transparent",
    borderRadius: 20,
    borderWidth: 0.01,
    borderColor: "transparent",
    overflow: "hidden",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    elevation: 1,
  },

  // iOS thumb shadow (좀 더 강하게)
  iosThumbShadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 8, height: 10 },
    shadowOpacity: 0.22,
    shadowRadius: 14,
  },

  // Android 근사
  androidTrackShadow: {
    elevation: 10,
  },
  androidThumbShadow: {
    elevation: 12,
  },

  // 트랙 내부를 살짝 부드럽게(필수 아님)
  innerSoftOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#FFFFFF",
  },
});
