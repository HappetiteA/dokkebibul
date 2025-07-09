import ChatHistory from "@/components/ChatHistory";
import DefaultHeader from "@/components/DefaultHeader";
import { ChatLog } from "@/components/interfaces";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ChatScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [chat, setChat] = useState<ChatLog>();

  useEffect(() => {
    navigation.setOptions({ title: `Chat #${id}` });
    setChat([
      {
        date: "2025-07-07",
        chat: [
          { sender: "A", message: "Chat #1", time: "10:00" },
          { sender: "B", message: "Chat #2", time: "10:35" },
          { sender: "A", message: "Chat #3", time: "10:38" },
        ],
      },
      {
        date: "2025-07-08",
        chat: [
          { sender: "B", message: "Chat #4", time: "09:59" },
          { sender: "B", message: "Chat #5", time: "10:00" },
          { sender: "A", message: "Chat #6", time: "10:01" },
        ],
      },
      {
        date: "2025-07-09",
        chat: [
          { sender: "B", message: "Chat #7", time: "10:01" },
          { sender: "A", message: "Chat #8", time: "10:03" },
          { sender: "B", message: "Chat #9", time: "10:10" },
        ],
      },
    ]);
  }, []);
  return (
    <>
      <DefaultHeader></DefaultHeader>
      <View>
        <Text>Hello Chat #{id}</Text>
        <ChatHistory chat={chat} />
      </View>
    </>
  );
}
