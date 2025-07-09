import ChatHistory from "@/components/ChatHistory";
import DefaultHeader from "@/components/DefaultHeader";
import { ChatLog } from "@/components/interfaces";
import { SampleChatData } from "@/dev/SampleData";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function ChatScreen() {
  const navigation = useNavigation();
  const { id } = useLocalSearchParams();
  const [chat, setChat] = useState<ChatLog>();
  const [text, setText] = useState<string>("");

  const onChangeText = (inputText: string) => {
    setText(inputText);
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
      <DefaultHeader></DefaultHeader>
      <View>
        <Text>Hello Chat #{id}</Text>
        <ChatHistory chat={chat} showAI={true} />
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

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: "#bdc3c7",
    margin: 10,
    padding: 10,
    fontSize: 20,
  },
});
