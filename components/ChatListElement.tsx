import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ShadowWrap from "./style/Shadow";

interface IChatListElementProp {
  conversation_id: string;
  user_ids: string;
  user_names: string;
  other_name: string;
  onLongPress: () => void;
}

export default function ChatListElement({
  conversation_id,
  user_ids,
  user_names,
  other_name,
  onLongPress,
}: IChatListElementProp) {
  return (
    <ShadowWrap>
      <Link
        href={{
          pathname: "/chat/[id]",
          params: {
            id: conversation_id,
            user_ids: user_ids,
            user_names: user_names,
          },
        }}
        asChild
      >
        <TouchableOpacity
          style={{ ...styles.container }}
          onLongPress={onLongPress}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={styles.icon}></View>
            <View style={styles.contents}>
              <View style={styles.horizontal}>
                <Text style={styles.name}>{other_name}</Text>
                <Text style={styles.time}>오후 2:00</Text>
              </View>
              <Text style={styles.chat}>채팅 미리보기</Text>
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
    backgroundColor: "red",
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
