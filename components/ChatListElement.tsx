import { Link } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface IChatListElementProp {
  id: string;
  onLongPress: () => void;
}

export default function ChatListElement({
  id,
  onLongPress,
}: IChatListElementProp) {
  return (
    <Link href={{ pathname: "/chat/[id]", params: { id: id } }} asChild>
      <TouchableOpacity style={styles.container} onLongPress={onLongPress}>
        <Text>Chat Room #{id}</Text>
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
