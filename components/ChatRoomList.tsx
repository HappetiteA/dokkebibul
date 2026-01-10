import { Button, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { getChatRooms } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "expo-router";
import ChatListElement from "./ChatListElement";
import { convertTimestampToTime } from "@/utils/time_converter";
import { ChatRoom } from "@/types/model.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatRoomDatas } from "./interfaces";

interface IChatRoomListProp {
  openModal: (name: string | undefined) => void;
}

export default function ChatRoomList({ openModal }: IChatRoomListProp) {
  const { profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    (async () => {
      const chatRoomData = (await getChatRooms()) ?? [];
      // 여기서 새로 업데이트 된 데이터를 asyncstorage에 넣고, setChatRoom 설정해준다.
      // asyncstorage에 넣을 때, map 형식으로 바꿔서 넣는다.

      const map: ChatRoomDatas = new Map();
      chatRoomData.forEach((value) => {
        const { id, ...rest } = value;
        map.set(id, rest);
      });

      const jsonStr = JSON.stringify(Object.fromEntries(map));
      AsyncStorage.setItem("ChatRoomData", jsonStr);
      setChatRooms(chatRoomData);
    })();
  }, []);

  const ChatList = (value: ChatRoom) => {
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
