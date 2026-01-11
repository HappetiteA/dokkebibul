import ChatHistory from "@/components/ChatHistory";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom, Message } from "@/types/model.types";
import { supabase } from "@/lib/supabase";
import { ChatRoomDatas } from "@/components/interfaces";
import { BackIcon, SendIcon, SettingsIcon } from "@/components/style/Icons";
import headerStyle from "@/components/style/headerStyle";
import ShadowWrap from "@/components/style/Shadow";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Link,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { getChatRooms } from "@/services/supabase";

type Chat = Omit<Message, "conversation_id">;
type ChatRoomData = Omit<ChatRoom, "id">;
export default function ChatScreen() {
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const conversation_id = params.id as string;

  const { profile } = useAuth();
  const [chat, setChat] = useState<Array<Chat>>([]);
  const [text, setText] = useState<string>("");
  const [AIenabled, setAIenabled] = useState<boolean>(false);
  const [chatRoomData, setChatRoomData] = useState<ChatRoomData>();

  const onChangeText = (inputText: string) => {
    setText(inputText);
  };

  const updateSetting = (value: ChatRoomData) => {
    if (profile == null || profile.user_id == null) {
      console.warn("Cannot update AI setting: user not authenticated");
      return;
    }

    console.log(value);

    const { last_msg, last_msg_created_at, user1_name, user2_name, ...rest } =
      value;
    const newData = {
      id: conversation_id,
      ...rest,
    };

    setText("");
    setChatRoomData(value);
    (async () => {
      const { error } = await supabase
        .from("conversations")
        .update(newData)
        .eq("id", conversation_id);

      if (error) {
        console.log(error);
        return;
      }

      const storageData = await AsyncStorage.getItem("ChatRoomData");
      if (storageData == null) {
        return;
      }

      const ChatRoomDataFromStorage = new Map<string, ChatRoomData>(
        Object.entries(JSON.parse(storageData))
      );
      ChatRoomDataFromStorage.set(conversation_id, value);
      const jsonStr = JSON.stringify(
        Object.fromEntries(ChatRoomDataFromStorage)
      );
      await AsyncStorage.setItem("ChatRoomData", jsonStr);
    })();
  };

  const onSubmit = async () => {
    if (text == "") return;
    if (!profile?.user_id) {
      console.warn("Cannot send message: user not authenticated");
      return;
    }

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversation_id,
      sender_id: profile.user_id,
      content: text,
      is_human: true,
    });

    if (error) {
      console.log(error);
      return;
    }

    setText("");
  };

  useEffect(() => {
    // get messages
    navigation.setOptions({ title: `Chat #${conversation_id}` });
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at, is_read, is_human")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });
      if (error) {
        console.log(error);
      }
      setChat(data ?? []);
    })();

    //set realtime chatting
    const channel = supabase
      .channel(`chatroom:${conversation_id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation_id}`,
        },
        (payload) => {
          const new_chat: Chat = {
            id: payload.new.id,
            sender_id: payload.new.sender_id,
            content: payload.new.content,
            created_at: payload.new.created_at,
            is_read: payload.new.is_read,
            is_human: payload.new.is_human,
          };
          setChat((c) => [...c, new_chat]);
        }
      )
      .subscribe();

    //get ChatRoomData from asyncstorage
    (async () => {
      const storageData = await AsyncStorage.getItem("ChatRoomData");
      if (storageData == null) {
        // load data from server and save at local storage
        const chatRoomData = (await getChatRooms()) ?? [];
        const map: ChatRoomDatas = new Map();
        chatRoomData.forEach((value) => {
          const { id, ...rest } = value;
          map.set(id, rest);
        });

        const jsonStr = JSON.stringify(Object.fromEntries(map));
        setChatRoomData(map.get(conversation_id));
        await AsyncStorage.setItem("ChatRoomData", jsonStr);

        return;
      }

      // can use asyncstorage data
      const ChatRoomDataFromStorage = new Map<string, ChatRoomData>(
        Object.entries(JSON.parse(storageData))
      );

      const data = ChatRoomDataFromStorage.get(conversation_id);
      setChatRoomData(data);
      if (profile?.user_id == data?.user1_id) {
        setAIenabled(data?.user1_ai_enabled ?? false);
      } else if (profile?.user_id == data?.user2_id) {
        setAIenabled(data?.user2_ai_enabled ?? false);
      } else {
        setAIenabled(false);
      }
    })();

    return () => {
      channel.unsubscribe();
    };
  }, [conversation_id, profile?.user_id]);

  return (
    <>
      {profile && chatRoomData ? (
        <>
          <ChatScreenHeader
            conversation_id={conversation_id}
            user_id={profile.user_id}
            AIenabled={AIenabled}
            setAIenabled={setAIenabled}
            chatRoomData={chatRoomData}
            updateSetting={updateSetting}
          ></ChatScreenHeader>
          <KeyboardAvoidingView
            style={{ flex: 1, marginBottom: 40 }}
            behavior={Platform.OS == "ios" ? "padding" : undefined}
          >
            <View style={{ flex: 1 }}>
              <ChatHistory
                chat={chat}
                user1_id={chatRoomData.user1_id}
                user1_name={chatRoomData.user1_name}
                user2_id={chatRoomData.user2_id}
                user2_name={chatRoomData.user2_name}
              />
              <ShadowWrap>
                <View style={styles.textInputView}>
                  <TextInput
                    editable={AIenabled}
                    value={text}
                    onChangeText={onChangeText}
                    placeholder={
                      AIenabled ? "AI가 대신 채팅중" : "Say Something..."
                    }
                    style={{ flex: 5, fontSize: 20 }}
                  />
                  <TouchableOpacity onPress={onSubmit} disabled={AIenabled}>
                    <SendIcon />
                  </TouchableOpacity>
                </View>
              </ShadowWrap>
            </View>
          </KeyboardAvoidingView>
        </>
      ) : (
        <>
          <ErrorChatScreenHeader />
          <Text>ERROR</Text>
        </>
      )}
    </>
  );
}

interface ChatScreenHeaderProp {
  conversation_id: string;
  user_id: string;
  AIenabled: boolean;
  setAIenabled: React.Dispatch<React.SetStateAction<boolean>>;
  chatRoomData: ChatRoomData;
  updateSetting: (value: ChatRoomData) => void;
}

function ChatScreenHeader({
  conversation_id,
  user_id,
  AIenabled,
  setAIenabled,
  chatRoomData,
  updateSetting,
}: ChatScreenHeaderProp) {
  const router = useRouter();

  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const getOtherName = () => {
    if (user_id == chatRoomData.user1_id) {
      return chatRoomData.user2_name;
    } else if (user_id == chatRoomData.user2_id) {
      return chatRoomData.user1_name;
    }
  };

  const onSwitchChange = () => {
    setAIenabled((c) => !c);

    const newData = { ...chatRoomData };
    if (user_id == newData.user1_id) {
      newData.user1_ai_enabled = AIenabled;
    } else if (user_id == newData.user2_id) {
      newData.user2_ai_enabled = AIenabled;
    }
    updateSetting(newData);
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={headerStyle.title}>{getOtherName()}</Text>
        </View>
        <View style={headerStyle.right}>
          <View style={{ justifyContent: "center" }}>
            <NeumorphicSwitch
              width={60}
              height={30}
              padding={5}
              value={AIenabled}
              onValueChange={onSwitchChange}
              onColor="#93D7EA"
              offColor="#D7D7E2"
            ></NeumorphicSwitch>
          </View>
          <ShadowWrap>
            <Link
              href={{
                pathname: "/chat/ChatSettings",
                params: { id: conversation_id },
              }}
              asChild
            >
              <TouchableOpacity style={headerStyle.button}>
                <SettingsIcon />
              </TouchableOpacity>
            </Link>
          </ShadowWrap>
        </View>
      </View>
    </View>
  );
}

function ErrorChatScreenHeader() {
  const router = useRouter();

  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
          </TouchableOpacity>
        </View>
        <View style={headerStyle.right}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textInputView: {
    flexDirection: "row",
    backgroundColor: "#F8F8FA",
    borderRadius: 30,
    marginHorizontal: 15,
    paddingVertical: 5,
    paddingLeft: 15,
    paddingRight: 5,
  },
});
