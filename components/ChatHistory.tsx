import { ScrollView, Text, View } from "react-native";
import { ChatLog, DailyChat } from "./interfaces";

interface ChatHistoryProp {
  chat?: ChatLog;
}
export default function ChatHistory({ chat }: ChatHistoryProp) {
  const ShowChatList = (dailyChat: DailyChat) => {
    return (
      <View>
        <Text>{dailyChat.date}</Text>
        {dailyChat.chat.map((value, index) => (
          <Text key={index}>
            {value.sender}({value.time}) : {value.message}
          </Text>
        ))}
      </View>
    );
  };

  return (
    <>
      <ScrollView>
        {chat?.map((value, index) => (
          <Text key={index}>{ShowChatList(value)}</Text>
        ))}
      </ScrollView>
    </>
  );
}
