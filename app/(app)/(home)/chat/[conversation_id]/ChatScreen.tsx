import ChatHistory from "@/components/ChatHistory";
import { useAuth } from "@/contexts/AuthContext";
import { ChatRoom, Message } from "@/types/model.types";
import { supabase } from "@/lib/supabase";
import { ChatRoomVM, toChatRoomVM } from "@/components/interfaces";
import {
  BackIcon,
  LockIcon,
  SendIcon,
  SettingsIcon,
} from "@/components/style/Icons";
import headerStyle, { BGStyle } from "@/components/style/commonStyle";
import { ShadowStyle } from "@/components/style/Shadow";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatRoom } from "@/contexts/ChatRoomContext";
import { useGlobalSetting } from "@/contexts/GlobalSettingContext";

type Chat = Omit<Message, "conversation_id">;

export default function ChatScreen() {
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const conversation_id = params.conversation_id as string;

  const { profile } = useAuth();
  const { chatRoomData, setAIenabled } = useChatRoom();
  const [chat, setChat] = useState<Array<Chat>>([]);
  const [text, setText] = useState<string>("");

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
    if (!conversation_id) return;
    if (!profile?.user_id) return;

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
    const channel = supabase.channel(`chatroom:${conversation_id}`).on(
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
    );

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [profile?.user_id, conversation_id]);

  // Change Asyncstorage & Server DB when chatRoomData modified

  return (
    <SafeAreaView style={BGStyle.BG}>
      {profile && conversation_id && chatRoomData ? (
        <>
          <ChatScreenHeader
            conversation_id={conversation_id}
            other_name={chatRoomData.other.name}
            AIenabled={chatRoomData.me.ai_enabled}
            setText={setText}
            setAIenabled={setAIenabled}
          ></ChatScreenHeader>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1, backgroundColor: "#F8F8FA" }}>
              <ChatHistory chat={chat} chatRoomData={chatRoomData} />
              <View style={[styles.textInputView, ShadowStyle.pill3d]}>
                <TextInput
                  editable={!chatRoomData.me.ai_enabled}
                  value={text}
                  onChangeText={onChangeText}
                  placeholder={
                    chatRoomData.me.ai_enabled
                      ? "도깨비불 모드 사용 중입니다."
                      : "Say Something..."
                  }
                  style={{ flex: 5, fontSize: 16 }}
                />
                <TouchableOpacity
                  onPress={onSubmit}
                  disabled={chatRoomData.me.ai_enabled}
                >
                  {chatRoomData.me.ai_enabled ? <LockIcon /> : <SendIcon />}
                </TouchableOpacity>
              </View>
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
  other_name: string;
  AIenabled: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setAIenabled: (value: boolean) => void;
}

function ChatScreenHeader({
  conversation_id,
  other_name,
  AIenabled,
  setText,
  setAIenabled,
}: ChatScreenHeaderProp) {
  const router = useRouter();
  const { globalSetting } = useGlobalSetting();

  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const onSwitchChange = async () => {
    setAIenabled(!AIenabled);
    setText("");
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={headerStyle.title}>{other_name}</Text>
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
              disabled={!globalSetting?.ai_enabled}
            ></NeumorphicSwitch>
          </View>
          <View style={[headerStyle.button, ShadowStyle.pill3d]}>
            <TouchableOpacity
              onPress={() => {
                router.navigate(
                  `/(app)/(home)/chat/${conversation_id}/ChatSettings`,
                );
              }}
            >
              <SettingsIcon />
            </TouchableOpacity>
          </View>
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
