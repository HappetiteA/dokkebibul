import { ScrollView, Text, View } from "react-native";
import { ChatLog, DailyChat } from "./interfaces";

interface ChatHistoryProp {
  chat?: ChatLog;
  showAI: boolean;
}
export default function ChatHistory({ chat, showAI }: ChatHistoryProp) {
  const TextColor = (AIgenerated: boolean) => {
    if (!showAI) {
      return { color: "black" };
    } else {
      if (AIgenerated) {
        return { color: "tomato" };
      } else {
        return { color: "teal" };
      }
    }
  };
  const ShowChatList = (dailyChat: DailyChat) => {
    return (
      <View>
        <Text>{dailyChat.date}</Text>
        {dailyChat.chat.map((value, index) => (
          <Text key={index} style={TextColor(value.AIgenerated)}>
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
