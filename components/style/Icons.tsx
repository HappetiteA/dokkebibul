import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, View } from "react-native";

export function SettingsIcon() {
  return (
    <View style={styles.inner_shadow}>
      <Image
        style={{ width: 36, height: 36 }}
        source={require("@/assets/from_figma/settings.png")}
      />
    </View>
  );
}

export function ProfilesIcon() {
  return (
    <View style={styles.inner_shadow}>
      <Image
        style={{ width: 36, height: 36 }}
        source={require("@/assets/from_figma/profiles.png")}
      />
    </View>
  );
}

export function BackIcon() {
  return (
    <View>
      <Ionicons name="chevron-back" size={28} color="#aaa" />
    </View>
  );
}

export function SendIcon() {
  return (
    <View>
      <Image
        style={{ width: 40, height: 40 }}
        source={require("@/assets/from_figma/send.png")}
      />
    </View>
  );
}
export function LockIcon() {
  return (
    <View>
      <Image
        style={{ width: 40, height: 40 }}
        source={require("@/assets/from_figma/lock.png")}
      />
    </View>
  );
}

export function PlaceIcon() {
  return (
    <View style={styles.large_inner_shadow}>
      <Image
        style={{ width: 57, height: 57 }}
        source={require("@/assets/from_figma/place.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  inner_shadow: {
    backgroundColor: "transparent",
    borderRadius: 30,
    borderWidth: 0.01,
    borderColor: "transparent",
    overflow: "hidden",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000000",
    shadowRadius: 3,
    shadowOpacity: 0.3,
    elevation: 1,
  },

  large_inner_shadow: {
    backgroundColor: "transparent",
    borderRadius: 30,
    borderWidth: 0.01,
    borderColor: "transparent",
    overflow: "hidden",
    shadowOffset: { width: 2, height: 2 },
    shadowColor: "#000000",
    shadowRadius: 6,
    shadowOpacity: 0.3,
    elevation: 1,
  },
});
