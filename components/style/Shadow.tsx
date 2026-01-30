import { Platform, StyleSheet, View } from "react-native";

interface ShadowWrapProp {
  children: React.ReactNode;
  borderRadius?: number;
}

export default function ShadowWrap({
  children,
  borderRadius = 20,
}: ShadowWrapProp) {
  return (
    <View style={[styles.outer_view_shadow, { borderRadius: borderRadius }]}>
      <View style={[styles.inner_view_shadow, { borderRadius: borderRadius }]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer_view_shadow:
    Platform.select({
      ios: {
        shadowColor: "#000000",
        shadowOffset: { width: 2, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 3,
      },
      android: {
        backgroundColor: "#F8F8FA", // Android 전용
        elevation: 7,
      },
    }) ?? {},

  inner_view_shadow:
    Platform.select({
      ios: {
        shadowColor: "#FFFFFF",
        shadowOffset: { width: -2, height: -3 },
        shadowOpacity: 0.6,
        shadowRadius: 3,
      },
      android: {
        // Android는 흰 shadow 대신 보더로 흉내
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderTopColor: "rgba(255,255,255,0.9)",
        borderLeftColor: "rgba(255,255,255,0.9)",
      },
    }) ?? {},
});
