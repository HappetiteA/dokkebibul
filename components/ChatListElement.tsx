import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ShadowWrap from "./style/Shadow";
import { getAvatarSource } from "@/utils/avatarColor";

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
  return (
    <ShadowWrap>
      <Link
        href={{
          pathname: `/(app)/(home)/chat/${conversation_id}/ChatScreen`,
        }}
        asChild
      >
        <TouchableOpacity
          style={{ ...styles.container }}
          onLongPress={onLongPress}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.icon}>
              <Image
                source={getAvatarSource(other_color_code)}
                style={styles.icon}
                resizeMethod="resize"
              />
            </View>
            <View style={styles.contents}>
              <View style={styles.horizontal}>
                <Text style={styles.name}>{other_name}</Text>
                <Text style={styles.time}>{time_string}</Text>
              </View>
              <Text style={styles.chat}>{last_msg}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Link>
    </ShadowWrap>
  );
}

const height = 55;
const padding = 5;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F8F8FA",

    height: height,
    marginVertical: 5,
    paddingHorizontal: padding,
    justifyContent: "center",
    borderRadius: 30,
  },
  vertical: {
    flexDirection: "column",
  },
  horizontal: {
    flexDirection: "row",
    width: 350 - height,
    justifyContent: "space-between",
  },
  icon: {
    width: height - padding * 2,
    height: height - padding * 2,
    borderRadius: height / 2 - padding,
  },
  contents: {
    flexDirection: "column",
    marginLeft: 10,
  },
  name: { fontSize: 16 },
  chat: { color: "#909090", fontSize: 14 },
  time: { color: "#909090", fontSize: 12 },
});
