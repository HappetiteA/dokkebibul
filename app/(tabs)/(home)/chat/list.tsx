import DefaultHeader from "@/components/DefaultHeader";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ChatList() {
  return (
    <>
      <DefaultHeader title="Chat List"></DefaultHeader>
      <View>
        <Text>Hello Chat List</Text>
        <Link href={{ pathname: "/chat/[id]", params: { id: 1 } }} asChild>
          <Text>Chat Room #1</Text>
        </Link>
        <Link href={{ pathname: "/chat/[id]", params: { id: 2 } }} asChild>
          <Text>Chat Room #2</Text>
        </Link>
        <Link href={{ pathname: "/chat/[id]", params: { id: 3 } }} asChild>
          <Text>Chat Room #3</Text>
        </Link>
      </View>
    </>
  );
}
