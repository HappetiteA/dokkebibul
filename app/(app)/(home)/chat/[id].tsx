import ChatHistory from "@/components/ChatHistory";
import { useAuth } from "@/contexts/AuthContext";
import { Message } from "@/types/model.types";
import { supabase } from "@/lib/supabase";
import { IAIenabled } from "@/components/interfaces";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [aiEnabled, setAiEnabled] = useState(false);

  const onChangeText = (inputText: string) => {
    setText(inputText);
  };

  const updateAISetting = (value: boolean) => {
    if (profile == null || profile.user_id == null) {
      console.warn("Cannot update AI setting: user not authenticated");
      return;
    }

    updateStorageData(value);
    (async () => {
      if (profile?.user_id == user_ids[0]) {
        const { error } = await supabase
          .from("conversations")
          .update({ user1_ai_enabled: value })
          .eq("id", conversation_id);

        if (error) {
          console.log(error);
        }
      } else {
        const { error } = await supabase
          .from("conversations")
          .update({ user2_ai_enabled: value })
          .eq("id", conversation_id);

        if (error) {
          console.log(error);
        }
      }
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

  const loadDataFromServer = () => {
    if (profile == null) {
      return false;
    }
    return profile.is_ai_enabled;
  };

  const insertStorageData = async (aiEnabled: boolean) => {
    const newData: IAIenabled = {
      global: {
        enabled: aiEnabled,
        last_fetched: Date.now(),
      },
    };
    const jsonStr = JSON.stringify(newData);
    await AsyncStorage.setItem("AIenabled", jsonStr);
  };

  const updateStorageData = async (aiEnabled: boolean) => {
    const aiEnableDataFromStorage = await AsyncStorage.getItem("AIenabled");
    if (aiEnableDataFromStorage == null) {
      return;
    }

    const aiEnabledData = JSON.parse(aiEnableDataFromStorage) as IAIenabled;
    aiEnabledData[conversation_id] = {
      enabled: aiEnabled,
      last_fetched: Date.now(),
    };
    const jsonStr = JSON.stringify(aiEnabledData);
    await AsyncStorage.setItem("AIenabled", jsonStr);
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

    // Load ai_enable from asyncstorage
    (async () => {
      const aiEnableDataFromStorage = await AsyncStorage.getItem("AIenabled");
      if (aiEnableDataFromStorage == null) {
        // load data from server and save at local storage
        // need to make new key value pair
        const dataFromServer = loadDataFromServer();
        insertStorageData(dataFromServer);
        setAiEnabled(dataFromServer);
        return;
      }

      const ONE_DAY = 24 * 60 * 60 * 1000;
      const aiEnabledData = JSON.parse(aiEnableDataFromStorage) as IAIenabled;
      // do not exist or expired
      if (
        aiEnabledData[conversation_id] == null ||
        aiEnabledData[conversation_id].last_fetched < Date.now() - ONE_DAY
      ) {
        // load data from server and save at local storage
        // need to add new row
        const dataFromServer = loadDataFromServer();
        updateStorageData(dataFromServer);
        setAiEnabled(dataFromServer);
        return;
      }

      // can use asyncstorage data
      setAiEnabled(aiEnabledData[conversation_id].enabled);
    })();
    return () => {
      channel.unsubscribe();
    };
  }, [conversation_id, profile?.user_id]);

  return (
    <>
      <ChatScreenHeader
        aiEnabled={aiEnabled}
        setAiEnable={setAiEnabled}
        updateAISetting={updateAISetting}
      ></ChatScreenHeader>
      <View>
        <Text>Hello Chat #{conversation_id}</Text>
        <ChatHistory chat={chat} user_ids={user_ids} user_names={user_names} />
      </View>
      <View>
        <TextInput
          editable={!aiEnabled}
          style={styles.textInput}
          value={text}
          onChangeText={onChangeText}
          placeholder="Say Something."
        />
        <Button title="submit" onPress={onSubmit} disabled={aiEnabled}></Button>
      </View>
    </>
  );
}

interface ChatScreenHeaderProp {
  aiEnabled: boolean;
  setAiEnable: React.Dispatch<React.SetStateAction<boolean>>;
  updateAISetting: (value: boolean) => void;
}

function ChatScreenHeader({
  aiEnabled,
  setAiEnable,
  updateAISetting,
}: ChatScreenHeaderProp) {
  const router = useRouter();

  const onSwitchChange = () => {
    updateAISetting(!aiEnabled);
    setAiEnable((c) => !c);
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
          <Switch value={aiEnabled} onChange={onSwitchChange}></Switch>
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
