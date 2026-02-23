import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { getChatRooms } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ChatListElement from "./ChatListElement";
import { convertTimestampToTime } from "@/utils/time_converter";
import { ChatRoom } from "@/types/model.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatRoomVM, toChatRoomVM } from "./interfaces";

interface IChatRoomListProp {
  openModal: (
    name: string,
    id: string,
    chat_id: string,
    is_user1: boolean,
  ) => void;
}

export default function ChatRoomList({ openModal }: IChatRoomListProp) {
  const { profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    (async () => {
      const chatRoomData = (await getChatRooms()) ?? [];

      const pairs: [string, string][] = chatRoomData.map((room) => [
        `ChatRoomData:${room.id}`,
        JSON.stringify(room),
      ]);

      await AsyncStorage.multiSet(pairs);

      setChatRooms(chatRoomData);
    })();
  }, []);

  const ChatList = (value: ChatRoom | undefined) => {
    if (!value) return <></>;

    let vm = toChatRoomVM(value, profile?.user_id);
    if (!vm) return <></>;
    if (!vm.me.chat_enabled) return <></>;
    if (vm.me.user_id == vm.other.user_id) return <></>;

    var time_string =
      value.last_msg == undefined
        ? ""
        : convertTimestampToTime(vm.last_msg_created_at);

    return (
      <ChatListElement
        key={vm.id}
        conversation_id={vm.id}
        other_name={vm.other.name}
        other_color_code={vm.other.color_code}
        last_msg={vm.last_msg}
        time_string={time_string}
        onLongPress={() => {
          openModal(
            vm.other.name,
            vm.other.user_id,
            value.id,
            value.user1_id == vm.me.user_id,
          );
        }}
      />
    );
  };

  return (
    <>
      {chatRooms.map((value) => (
        <View key={value.id}>{ChatList(value)}</View>
      ))}
    </>
  );
}
