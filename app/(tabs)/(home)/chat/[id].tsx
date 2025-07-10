import ChatHistory from "@/components/ChatHistory";
import { ChatLog } from "@/components/interfaces";
import { SampleChatData } from "@/dev/SampleData";
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

export default function ChatScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [chat, setChat] = useState<ChatLog>();
  const [text, setText] = useState<string>("");
  const [showAI, setShowAI] = useState(false);

  const onChangeText = (inputText: string) => {
    setText(inputText);
  };

  const updateShowAI = (value: boolean) => {
    setShowAI(value);
  };

  const onSubmit = () => {
    // setChat
    // Backend Thing...
  };

  useEffect(() => {
    navigation.setOptions({ title: `Chat #${id}` });
    setChat(SampleChatData);
  }, []);
  return (
    <>
      <ChatScreenHeader updateShowAI={updateShowAI}></ChatScreenHeader>
      <View>
        <Text>Hello Chat #{id}</Text>
        <ChatHistory chat={chat} showAI={showAI} />
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
