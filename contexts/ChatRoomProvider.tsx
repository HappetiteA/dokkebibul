import { useEffect, useMemo, useRef, useState } from "react";
import { ChatRoomContext } from "./ChatRoomContext";
import {
  ChatRoomVM,
  ChatSettingUpdate,
  toChatRoom,
  toChatRoomVM,
} from "@/components/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getChatRooms } from "@/services/supabase";
import { ChatRoom } from "@/types/model.types";
import { Alert } from "react-native";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

export function ChatRoomProvider({
  conversation_id,
  children,
}: {
  conversation_id: string;
  children: React.ReactNode;
}) {
  const { profile } = useAuth();
  const initRef = useRef(false);
  const snapshotRef = useRef<ChatRoomVM | null>(null);
  const [chatRoomData, setChatRoomData] = useState<ChatRoomVM>();

  useEffect(() => {
    (async () => {
      const storageData = await AsyncStorage.getItem(
        `ChatRoomData:${conversation_id}`,
      );
      if (storageData == null) {
        // load data from server and save at local storage
        const chatRoomList = (await getChatRooms()) ?? [];
        let chatRoom: ChatRoom | undefined = undefined;
        for (let i = 0; i < chatRoomList.length; i++) {
          if (chatRoomList[i].id == conversation_id) {
            chatRoom = chatRoomList[i];
          }
        }

        if (!chatRoom) {
          console.log("this chat room does not exists");
        }

        try {
          await AsyncStorage.setItem(
            `ChatRoomData:${conversation_id}`,
            JSON.stringify(chatRoom),
          );
          setChatRoomData(toChatRoomVM(chatRoom, profile?.user_id));
          initRef.current = true;
        } catch (err: any) {
          Alert.alert("Asyncstorage Error", err.message);
        }
        return;
      }

      // can use asyncstorage data
      try {
        let chatRoom = JSON.parse(storageData) as ChatRoom;
        setChatRoomData(toChatRoomVM(chatRoom, profile?.user_id));
        initRef.current = true;
      } catch (err: any) {
        Alert.alert("ChatRoomData parsing error", err.message);
      }
    })();
  }, [conversation_id]);

  useEffect(() => {
    if (!initRef.current) return;
    if (!chatRoomData) return;

    (async () => {
      try {
        await AsyncStorage.setItem(
          `ChatRoomData:${conversation_id}`,
          JSON.stringify(toChatRoom(chatRoomData)),
        );
      } catch {
        console.error("AsyncStorage Error : cannot save chat room data");
      }
    })();
  }, [chatRoomData]);

  const setAIenabled = (value: boolean) => {
    if (!chatRoomData) {
      console.error(`ChatRoomData for id ${conversation_id} does not exists`);
      return;
    }
    snapshotRef.current = chatRoomData;

    const toServer = {
      ...chatRoomData,
      me: {
        ...chatRoomData.me,
        ai_enabled: value,
      },
    };

    setChatRoomData((c) => {
      if (!c) return c;

      return {
        ...c,
        me: {
          ...c.me,
          ai_enabled: value,
        },
      };
    });

    try {
      patchChatRoomOnServer(toServer);
    } catch (e: any) {
      const status = e?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        const snap = snapshotRef.current;
        if (snap) setChatRoomData(snap);
      } else {
        // 네트워크/5xx는 롤백 안 하고 두는 쪽이 일반적
        // (원하면 여기서 Alert 정도만)
        console.warn(
          "Warning : network error occured when patching conversation setting",
        );
      }
    }
  };

  const setNotiEnabled = (value: boolean) => {
    if (!chatRoomData) {
      console.error(`ChatRoomData for id ${conversation_id} does not exists`);
      return;
    }
    snapshotRef.current = chatRoomData;

    const toServer = {
      ...chatRoomData,
      me: {
        ...chatRoomData.me,
        noti_enabled: value,
      },
    };

    setChatRoomData((c) => {
      if (!c) return c;

      return {
        ...c,
        me: {
          ...c.me,
          noti_enabled: value,
        },
      };
    });

    try {
      patchChatRoomOnServer(toServer);
    } catch (e: any) {
      const status = e?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        const snap = snapshotRef.current;
        if (snap) setChatRoomData(snap);
      } else {
        // 네트워크/5xx는 롤백 안 하고 두는 쪽이 일반적
        // (원하면 여기서 Alert 정도만)
        console.warn(
          "Warning : network error occured when patching conversation setting",
        );
      }
    }
  };

  const setChatEnabled = (value: boolean) => {
    if (!chatRoomData) {
      console.error(`ChatRoomData for id ${conversation_id} does not exists`);
      return;
    }
    snapshotRef.current = chatRoomData;

    const toServer = {
      ...chatRoomData,
      me: {
        ...chatRoomData.me,
        chat_enabled: value,
      },
    };

    setChatRoomData((c) => {
      if (!c) return c;

      return {
        ...c,
        me: {
          ...c.me,
          chat_enabled: value,
        },
      };
    });

    try {
      patchChatRoomOnServer(toServer);
    } catch (e: any) {
      const status = e?.status;
      if (typeof status === "number" && status >= 400 && status < 500) {
        const snap = snapshotRef.current;
        if (snap) setChatRoomData(snap);
      } else {
        // 네트워크/5xx는 롤백 안 하고 두는 쪽이 일반적
        // (원하면 여기서 Alert 정도만)
        console.warn(
          "Warning : network error occured when patching conversation setting",
        );
      }
    }
  };

  const patchChatRoomOnServer = async (newChatRoomData: ChatRoomVM) => {
    if (!newChatRoomData) return;

    const raw_data = toChatRoom(newChatRoomData);
    const data: ChatSettingUpdate = {
      user1_ai_enabled: raw_data.user1_ai_enabled,
      user1_chat_enabled: raw_data.user1_chat_enabled,
      user1_noti_enabled: raw_data.user1_noti_enabled,
      user2_ai_enabled: raw_data.user2_ai_enabled,
      user2_chat_enabled: raw_data.user2_chat_enabled,
      user2_noti_enabled: raw_data.user2_noti_enabled,
    };

    const { error } = await supabase
      .from("conversations")
      .update(data)
      .eq("id", conversation_id);
    if (error) throw error;
  };

  const value = useMemo(
    () => ({
      chatRoomData,
      setChatRoomData,
      setAIenabled,
      setNotiEnabled,
      setChatEnabled,
    }),
    [chatRoomData],
  );
  return (
    <ChatRoomContext.Provider value={value}>
      {children}
    </ChatRoomContext.Provider>
  );
}
