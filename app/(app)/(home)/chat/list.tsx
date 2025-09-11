import DefaultHeader from "@/components/DefaultHeader";
import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function ChatListScreen() {
  return (
    <>
      <DefaultHeader title="Chat List"></DefaultHeader>
      <View>
        <Text>Hello Chat List</Text>
        <Link href={{ pathname: "/chat/[id]", params: { id: "asdf" } }} asChild>
          <Text>Chat Room #1</Text>
        </Link>
        <Link href={{ pathname: "/chat/[id]", params: { id: "ewfd" } }} asChild>
          <Text>Chat Room #2</Text>
        </Link>
        <Link
          href={{ pathname: "/chat/[id]", params: { id: "awegdv" } }}
          asChild
        >
          <Text>Chat Room #3</Text>
        </Link>
      </View>
    </>
  );
}
