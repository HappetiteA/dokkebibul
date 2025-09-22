import { Button, View } from "react-native";
import ChatListElement from "./ChatListElement";
import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getChatRooms } from "@/hooks/data";
import { useAuth } from "@/utils/AuthContext";

interface IChatRoomListProp {
  setModalOpen: (arg0: boolean) => void;
}

interface IChatRoomData {
  created_at: string;
  id: string;
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

export default function ChatRoomList({ setModalOpen }: IChatRoomListProp) {
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

    return (
      <ChatListElement
        key={value.id}
        id={value.id}
        other_name={other_name}
        onLongPress={() => {
          setModalOpen(true);
        }}
      />
    );
  };

  return <>{chatRooms.map((value) => ChatList(value))}</>;
}
