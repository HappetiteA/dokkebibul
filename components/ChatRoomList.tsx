import { Button, StyleSheet, TouchableOpacity, View } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { getChatRooms } from "@/services/supabase";
import { useAuth } from "@/contexts/AuthContext";
import ChatListElement from "./ChatListElement";
import {
  convertTimestampToTime,
  formatTimestamp,
} from "@/utils/time_converter";
import { ChatRoom } from "@/types/model.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatRoomVM, toChatRoomVM } from "./interfaces";
import { useFocusEffect } from "expo-router";
import { Text } from "@/components/Text";

interface IChatRoomListProp {
  updateTrigger: boolean;
  openModal: (
    name: string,
    id: string,
    chat_id: string,
    is_user1: boolean,
  ) => void;
}

export default function ChatRoomList({
  updateTrigger,
  openModal,
}: IChatRoomListProp) {
  const { profile } = useAuth();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);

  useEffect(() => {
    (async () => {
      AsyncStorage.getAllKeys((err, keys) => {
        if (err) {
          console.error(
            "Asyncstorage Error when rendering Chat room list : ",
            err.message,
          );
        }
        if (!keys) {
          setChatRooms([]);
          return;
        }

        let chatRoomKeys: string[] = [];
        keys.forEach((value) => {
          if (value.startsWith("ChatRoomData:")) {
            chatRoomKeys.push(value);
          }
        });

        AsyncStorage.multiGet(chatRoomKeys, (err, stores) => {
          let chatRoomData: ChatRoom[] = [];
          stores?.forEach((result) => {
            // get at each store's key/value so you can work with it
            if (!result[1]) return "";
            try {
              chatRoomData.push(JSON.parse(result[1]) as ChatRoom);
            } catch (parseErr) {
              console.error("Failed to parse ChatRoom data:", parseErr);
            }
          });

          setChatRooms(chatRoomData);
        });
      });
    })();
  }, [updateTrigger]);

  const ChatList = (value: ChatRoom | undefined) => {
    if (!value) return <></>;

    let vm = toChatRoomVM(value, profile?.user_id);
    if (!vm) return <></>;
    if (!vm.me.chat_enabled) return <></>;
    if (vm.me.user_id == vm.other.user_id) return <></>;

    var time_string =
      value.last_msg == undefined
        ? ""
        : formatTimestamp(vm.last_msg_created_at);

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
