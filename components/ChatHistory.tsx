import { ScrollView, Text, View } from "react-native";
import { Message } from "@/utils/model.types";

type Chat = Omit<Message, "id" | "conversation_id">;

interface ChatHistoryProp {
  chat?: Array<Chat>;
  user_ids: string[];
  user_names: string[];
}
export default function ChatHistory({
  chat,
  user_ids,
  user_names,
}: ChatHistoryProp) {
  const TextColor = (AIgenerated: boolean) => {
    if (AIgenerated) {
      return { color: "tomato" };
    } else {
      return { color: "teal" };
    }
  };

  const convertUIDtoUserName = (user_id: string) => {
    var idx = user_ids.findIndex((value) => value == user_id);
    return user_names[idx];
  };

  const convertTimestampToTime = (timestamp: string): string => {
    const date = new Date(timestamp);

    var hours = date.getHours().toString();
    hours = hours.length == 1 ? "0" + hours : hours;

    var minutes = date.getMinutes().toString();
    minutes = minutes.length == 1 ? "0" + minutes : minutes;

    const timeString = hours + ":" + minutes;
    return timeString;
  };

  return (
    <>
      <ScrollView style={{ height: 500 }}>
        {chat?.map((value, index) => (
          <View key={index}>
            <Text style={TextColor(value.is_human)}>
              {convertUIDtoUserName(value.sender_id)}(
              {convertTimestampToTime(value.created_at)})
            </Text>
            <Text style={TextColor(value.is_human)}>{value.content}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
