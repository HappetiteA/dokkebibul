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
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
  useRouter,
} from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "@/components/Text";
import { TextInput } from "@/components/TextInput";
import { NeumorphicSwitch } from "@/components/style/Switch";
import { SafeAreaView } from "react-native-safe-area-context";
import { useChatRoom } from "@/contexts/ChatRoomContext";
import { useGlobalSetting } from "@/contexts/GlobalSettingContext";
import SelfChatHistory from "@/components/SelfChatHistory";
import { AISettingErrorModal } from "@/components/modals/AISettingError";
import useModal from "@/hooks/useModal";

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

  useFocusEffect(
    useCallback(() => {
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
            //console.log(payload);
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
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error("연결 실패 - 권한이나 설정을 확인하세요.");
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    }, [conversation_id, profile?.user_id]),
  );

  return (
    <SafeAreaView style={BGStyle.BG}>
      {profile && conversation_id && chatRoomData ? (
        <>
          <ChatScreenHeader
            conversation_id={conversation_id}
            other_name={chatRoomData.other.name}
            AIenabled={chatRoomData.me.ai_enabled}
            is_self_chat={chatRoomData.me.user_id == chatRoomData.other.user_id}
            setText={setText}
            setAIenabled={setAIenabled}
          ></ChatScreenHeader>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS == "ios" ? "padding" : "height"}
          >
            <View style={{ flex: 1, backgroundColor: "#F8F8FA" }}>
              {chatRoomData.me.user_id != chatRoomData.other.user_id ? (
                <ChatHistory chat={chat} chatRoomData={chatRoomData} />
              ) : (
                <SelfChatHistory chat={chat} chatRoomData={chatRoomData} />
              )}
              <View style={[styles.textInputView, ShadowStyle.pill3d]}>
                <TextInput
                  editable={!chatRoomData.me.ai_enabled}
                  value={text}
                  onChangeText={onChangeText}
                  placeholder={
                    chatRoomData.me.ai_enabled
                      ? "도깨비불 모드 사용 중입니다."
                      : ""
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
  is_self_chat: boolean;
  AIenabled: boolean;
  setText: React.Dispatch<React.SetStateAction<string>>;
  setAIenabled: (value: boolean) => void;
}

function ChatScreenHeader({
  conversation_id,
  other_name,
  is_self_chat,
  AIenabled,
  setText,
  setAIenabled,
}: ChatScreenHeaderProp) {
  const router = useRouter();
  const { globalSetting } = useGlobalSetting();
  const { open: openAISettingErrorModal, close: closeAISettingErrorModal } =
    useModal(AISettingErrorModal);

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
          <Text style={headerStyle.title}>
            {is_self_chat ? "도깨비불" : other_name}
          </Text>
        </View>
        <View style={headerStyle.right}>
          {!is_self_chat ? (
            <>
              <View style={{ justifyContent: "center" }}>
                <TouchableOpacity
                  activeOpacity={1.0}
                  onPress={() => {
                    if (!globalSetting?.ai_enabled)
                      openAISettingErrorModal({
                        onClose: closeAISettingErrorModal,
                      });
                  }}
                >
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
                </TouchableOpacity>
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
            </>
          ) : (
            <></>
          )}
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
