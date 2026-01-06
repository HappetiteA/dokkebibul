import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { getChatRooms } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";
import ChatListElement from "./ChatListElement";
import { convertTimestampToTime } from "@/utils/time_converter";

interface IChatRoomListProp {
  openModal: (name: string | undefined) => void;
}

interface IChatRoomData {
  created_at: string;
  id: string;
  last_msg: string;
  last_msg_created_at: string;
  user1_ai_enabled: boolean;
  user1_chat_enabled: boolean;
  user1_id: string;
  user1_name: string;
  user1_noti_enabled: boolean;
  user2_ai_enabled: boolean;
  user2_chat_enabled: boolean;
  user2_id: string;
  user2_name: string;
  user2_noti_enabled: boolean;
}

export default function ChatRoomList({ openModal }: IChatRoomListProp) {
  const { profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<IChatRoomData[]>([]);

  useEffect(() => {
    (async () => {
      const chatRoomData = await getChatRooms();
      setChatRooms(chatRoomData ?? []);
    })();
  }, []);

  const ChatList = (value: IChatRoomData) => {
    var is_user1 = profile?.user_id == value.user1_id;
    var other_id: string;
    var other_name: string;
    var is_enabled: boolean;
    if (is_user1) {
      other_id = value.user2_id;
      other_name = value.user2_name;
      is_enabled = value.user1_chat_enabled;
    } else {
      other_id = value.user1_id;
      other_name = value.user1_name;
      is_enabled = value.user2_chat_enabled;
    }

    if (!is_enabled) {
      return <></>;
    }

    var user_ids = JSON.stringify([value.user1_id, value.user2_id]);
    var user_names = JSON.stringify([value.user1_name, value.user2_name]);
    var time_string =
      value.last_msg == undefined
        ? ""
        : convertTimestampToTime(value.last_msg_created_at);

    return (
      <ChatListElement
        key={value.id}
        conversation_id={value.id}
        user_ids={user_ids}
        user_names={user_names}
        other_name={other_name}
        last_msg={value.last_msg}
        time_string={time_string}
        onLongPress={() => {
          openModal(other_name);
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
