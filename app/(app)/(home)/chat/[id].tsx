import ChatHistory from "@/components/ChatHistory";
import { useAuth } from "@/utils/AuthContext";
import { Message } from "@/utils/global.types";
import { supabase } from "@/utils/supabase";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Chat = Omit<Message, "id" | "conversation_id">;

export default function ChatScreen() {
  const navigation = useNavigation();

  const params = useLocalSearchParams();
  const conversation_id = params.id as string;
  const user_ids = JSON.parse(params.user_ids as string);
  const user_names = JSON.parse(params.user_names as string);

  const { profile } = useAuth();
  const [chat, setChat] = useState<Array<Chat>>([]);
  const [text, setText] = useState<string>("");
  const [showAI, setShowAI] = useState(false);

  const onChangeText = (inputText: string) => {
    setText(inputText);
  };

  const updateShowAI = (value: boolean) => {
    setShowAI(value);
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
    navigation.setOptions({ title: `Chat #${conversation_id}` });
    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("sender_id, content, created_at, is_read, is_human")
        .eq("conversation_id", conversation_id)
        .order("created_at", { ascending: true });
      if (error) {
        console.log(error);
      }
      setChat(data ?? []);
    })();

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

    return () => {
      channel.unsubscribe();
    };
  }, [conversation_id]);

  return (
    <>
      <ChatScreenHeader updateShowAI={updateShowAI}></ChatScreenHeader>
      <View>
        <Text>Hello Chat #{conversation_id}</Text>
        <ChatHistory
          chat={chat}
          user_ids={user_ids}
          user_names={user_names}
          showAI={showAI}
        />
      </View>
      <View>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={onChangeText}
          placeholder="Say Something."
        />
        <Button title="submit" onPress={onSubmit}></Button>
      </View>
    </>
  );
}

interface ChatScreenHeaderProp {
  updateShowAI: (value: boolean) => void;
}

function ChatScreenHeader({ updateShowAI }: ChatScreenHeaderProp) {
  const router = useRouter();
  const [isOn, setIsOn] = useState(false);
  const onSwitchChange = () => {
    setIsOn((c) => !c);
    updateShowAI(!isOn);
  };
  const onPressBackBtn = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onPressBackBtn}>
            <Text>Back</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.headerRight}>
          <Switch value={isOn} onChange={onSwitchChange}></Switch>
          <TouchableOpacity style={styles.headerButton}>
            <Text>Setting</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#bdc3c7",
  },
  headerContent: {
    marginTop: 50,
    height: 50,
    flexDirection: "row",
    textAlignVertical: "center",
    justifyContent: "space-between",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  headerLeft: {
    justifyContent: "center",
    marginLeft: 20,
  },
  headerButton: {
    width: 48,
    height: 48,
    backgroundColor: "#95a5a6",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  textInput: {
    backgroundColor: "#bdc3c7",
    margin: 10,
    padding: 10,
    fontSize: 20,
  },
});
