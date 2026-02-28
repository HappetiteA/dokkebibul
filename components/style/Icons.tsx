import { Image, View } from "react-native";

export function SettingsIcon() {
  return (
    <View>
      <Image
        style={{ width: 40, height: 40 }}
        source={require("@/assets/from_figma/settings.png")}
      />
    </View>
  );
}

export function ProfilesIcon() {
  return (
    <View>
      <Image
        style={{ width: 40, height: 40 }}
        source={require("@/assets/from_figma/profiles.png")}
      />
    </View>
  );
}

export function BlockIcon() {
  return (
    <View>
      <Image
        style={{ width: 36, height: 36 }}
        source={require("@/assets/from_figma/block.png")}
      />
    </View>
  );
}

export function ReportIcon() {
  return (
    <View>
      <Image
        style={{ width: 36, height: 36 }}
        source={require("@/assets/from_figma/report.png")}
      />
    </View>
  );
}

export function BackIcon() {
  return (
    <View>
      <Image
        style={{ width: 15, height: 28 }}
        source={require("@/assets/from_figma/back_btn.png")}
      />
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
    <View>
      <Image
        style={{ width: 57, height: 57 }}
        source={require("@/assets/from_figma/place.png")}
      />
    </View>
  );
}

export function EditIcon() {
  return (
    <View>
      <Image
        style={{ width: 36, height: 36 }}
        source={require("@/assets/from_figma/edit.png")}
      />
    </View>
  );
}
