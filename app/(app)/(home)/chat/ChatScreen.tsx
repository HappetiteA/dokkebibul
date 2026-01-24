import ChatHistory from "@/components/ChatHistory";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom, Message } from "@/types/model.types";
import { supabase } from "@/lib/supabase";
import { ChatRoomDatas } from "@/components/interfaces";
import { BackIcon, SendIcon, SettingsIcon } from "@/components/style/Icons";
import headerStyle, { BGStyle } from "@/components/style/commonStyle";
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
  Alert,
  Image,
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
import { SafeAreaView } from "react-native-safe-area-context";

type Chat = Omit<Message, "conversation_id">;
type ChatRoomData = Omit<ChatRoom, "id">;
export default function ChatScreen() {
  const navigation = useNavigation();

  const params = useLocalSearchParams();

  const { profile } = useAuth();
  const [conversation_id, setConversationId] = useState<string>();
  const [chat, setChat] = useState<Array<Chat>>([]);
  const [text, setText] = useState<string>("");
  const [AIenabled, setAIenabled] = useState<boolean>(false);
  const [chatRoomData, setChatRoomData] = useState<ChatRoomData>();

  const updateSetting = async (value: ChatRoomData) => {
    if (profile == null || profile.user_id == null) {
      console.warn("Cannot update AI setting: user not authenticated");
      return true;
    }

    if (conversation_id == null) {
      console.warn("Cannot update AI setting: conversation doesn't exist");
      return true;
    }

    const { last_msg, last_msg_created_at, user1_name, user2_name, ...rest } =
      value;
    const newData = {
      id: conversation_id,
      ...rest,
    };

    const { error } = await supabase
      .from("conversations")
      .update(newData)
      .eq("id", conversation_id);

    if (error) {
      console.log(error);
      return true;
    }

    try {
      const storageData = await AsyncStorage.getItem("ChatRoomData");
      if (storageData == null) {
        console.warn("ChatRoomData not found, cannot update setting");
        return true;
      }

      const ChatRoomDataFromStorage = new Map<string, ChatRoomData>(
        Object.entries(JSON.parse(storageData)),
      );
      ChatRoomDataFromStorage.set(conversation_id, value);
      const jsonStr = JSON.stringify(
        Object.fromEntries(ChatRoomDataFromStorage),
      );
      await AsyncStorage.setItem("ChatRoomData", jsonStr);
      setChatRoomData(value);
      return false;
    } catch (err: any) {
      Alert.alert("Error while updating setting", err.message);
      return true;
    }
  };

  const onChangeText = (inputText: string) => {
    setText(inputText);
  };

  const onSubmit = async () => {
    if (text == "") return;
    if (!profile?.user_id) {
      console.warn("Cannot send message: user not authenticated");
      return;
    }

    if (conversation_id == null) {
      console.warn("Cannot send message: conversation doesn't exist");
      return true;
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
    if (params.id) {
      setConversationId(params.id as string);
    } else {
      let id1 = params.user1_id as string;
      let id2 = params.user2_id as string;
      const user1_id = id1 < id2 ? id1 : id2;
      const user2_id = id1 > id2 ? id1 : id2;
      (async () => {
        const { data, error } = await supabase
          .from("conversations")
          .select("id")
          .eq("user1_id", user1_id)
          .eq("user2_id", user2_id)
          .single();
        if (error || !data) {
          console.log("no conversation id found");
          return;
        }
        setConversationId(data.id);
      })();
    }
  }, [profile?.user_id]);

  useEffect(() => {
    if (!conversation_id) return;

    // get messages
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
        },
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

        try {
          const jsonStr = JSON.stringify(Object.fromEntries(map));
          await AsyncStorage.setItem("ChatRoomData", jsonStr);

          const data = map.get(conversation_id);
          setChatRoomData(data);
          if (profile?.user_id == data?.user1_id) {
            setAIenabled(data?.user1_ai_enabled ?? false);
          } else if (profile?.user_id == data?.user2_id) {
            setAIenabled(data?.user2_ai_enabled ?? false);
          } else {
            setAIenabled(false);
          }
        } catch (err: any) {
          Alert.alert("Asyncstorage Error", err.message);
        }
        return;
      }

      // can use asyncstorage data
      try {
        const ChatRoomDataFromStorage = new Map<string, ChatRoomData>(
          Object.entries(JSON.parse(storageData)),
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
      } catch (err: any) {
        Alert.alert("ChatRoomData parsing error", err.message);
      }
    })();

    return () => {
      channel.unsubscribe();
    };
  }, [conversation_id]);

  return (
    <SafeAreaView style={BGStyle.BG}>
      {profile && conversation_id && chatRoomData ? (
        <>
          <ChatScreenHeader
            conversation_id={conversation_id}
            user_id={profile.user_id}
            setText={setText}
            AIenabled={AIenabled}
            setAIenabled={setAIenabled}
            chatRoomData={chatRoomData}
            updateSetting={updateSetting}
          ></ChatScreenHeader>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1, backgroundColor: "#F8F8FA" }}>
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
                    editable={!AIenabled}
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
    </SafeAreaView>
  );
}

interface ChatScreenHeaderProp {
  conversation_id: string;
  user_id: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  AIenabled: boolean;
  setAIenabled: React.Dispatch<React.SetStateAction<boolean>>;
  chatRoomData: ChatRoomData;
  updateSetting: (value: ChatRoomData) => Promise<boolean>;
}

function ChatScreenHeader({
  conversation_id,
  user_id,
  setText,
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
    return "Unknown";
  };

  const onSwitchChange = async () => {
    const newData = { ...chatRoomData };
    if (user_id == newData.user1_id) {
      newData.user1_ai_enabled = !AIenabled;
    } else if (user_id == newData.user2_id) {
      newData.user2_ai_enabled = !AIenabled;
    }

    setAIenabled((c) => !c);
    const failed = await updateSetting(newData);
    if (failed) {
      setAIenabled((c) => !c);
      return;
    }

    setText("");
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
              width={54}
              height={30}
              padding={3}
              value={AIenabled}
              onValueChange={onSwitchChange}
              onColor="#93D7EA"
              offColor="#D7D7E2"
              renderThumbContent={({ value, size }) => (
                <Image
                  source={
                    value
                      ? require("@/assets/from_figma/fire_on.png")
                      : require("@/assets/from_figma/fire_off.png")
                  }
                  style={{
                    width: size,
                    height: size,
                    resizeMode: "contain",
                  }}
                />
              )}
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
