import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

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
      <TouchableOpacity style={styles.container} onLongPress={onLongPress}>
        <Text>Chat Room #{other_name}</Text>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#b3b3b3",
    height: 40,
    marginVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    borderRadius: 20,
  },
});
