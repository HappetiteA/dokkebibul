import { StyleSheet, View } from "react-native";

interface ShadowWrapProp {
  children: React.ReactNode;
}

export default function ShadowWrap({ children }: ShadowWrapProp) {
  return (
    <View style={styles.outer_shadow}>
      <View style={styles.inner_shadow}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer_shadow: {
    shadowColor: "#000000",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  inner_shadow: {
    shadowColor: "#FFFFFF",
    shadowOffset: { width: -2, height: -3 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
  },
});
