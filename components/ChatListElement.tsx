import { Link } from "expo-router";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ShadowStyle } from "./style/Shadow";
import { getAvatarSource } from "@/utils/avatarColor";
import { Text } from "@/components/Text";

interface IChatListElementProp {
  conversation_id: string;
  other_name: string;
  other_color_code: number;
  last_msg: string;
  time_string: string;
  onLongPress: () => void;
}

export default function ChatListElement({
  conversation_id,
  other_name,
  other_color_code,
  last_msg,
  time_string,
  onLongPress,
}: IChatListElementProp) {
  const { width: W } = Dimensions.get("window");

  return (
    <View style={[styles.container, ShadowStyle.pill3d]}>
      <Link
        href={{
          pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
        }}
        asChild
      >
        <TouchableOpacity onLongPress={onLongPress}>
          <View style={{ flexDirection: "row" }}>
            <View style={styles.icon}>
              <Image
                source={getAvatarSource(other_color_code)}
                style={styles.icon}
                resizeMethod="resize"
              />
            </View>
            <View style={styles.contents}>
              <View style={[styles.horizontal, { width: W - height - 40 }]}>
                <Text style={styles.name}>{other_name}</Text>
                <Text style={styles.time}>{time_string}</Text>
              </View>
              <Text style={styles.chat} numberOfLines={1} ellipsizeMode="tail">
                {last_msg}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const height = 60;
const padding = 10;
const iconSize = 40;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8FA",

    height: height,
    marginVertical: 5,
    paddingHorizontal: padding,
    justifyContent: "center",
    borderRadius: 35,
  },
  vertical: {
    flexDirection: "column",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  icon: {
    width: iconSize,
    height: iconSize,
    borderRadius: iconSize / 2,
    backgroundColor: "#f8f8fa",
  },
  contents: {
    flexDirection: "column",
    marginLeft: 10,
  },
  name: { fontSize: 16 },
  chat: {
    color: "#909090",
    fontSize: 14,
    width: "70%",
  },
  time: { color: "#909090", fontSize: 12, textAlign: "right" },
});
