import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Message } from "@/types/model.types";
import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

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
  const { profile } = useAuth();

  const TextBox = (value: Chat, color: string) => {
    return (
      <View
        style={{
          width: "auto",
          maxWidth: 200,
          backgroundColor: color,
          padding: 8,
          marginHorizontal: 10,
          marginVertical: 3,
          borderRadius: 10,
        }}
      >
        <Text style={{ textAlign: "left", fontSize: 16 }}>{value.content}</Text>
      </View>
    );
  };

  const TextElement = (isMe: boolean, value: Chat) => {
    if (isMe) {
      //Right Aligned
      return (
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          {TextBox(value, "#99D8EE")}
        </View>
      );
    } else {
      // Left Aligned
      return (
        <View style={{ flexDirection: "row" }}>
          {TextBox(value, "#E4E4EA")}
          <View style={{ flex: 1 }} />
        </View>
      );
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

  const isMe = (id: string) => {
    return id == profile?.user_id;
  };

  const showName = (chat: Chat[], value: Chat, index: number) => {
    if (isMe(value.sender_id)) return false;
    if (index == 0) return true;

    return value.sender_id != chat[index - 1].sender_id;
  };

  const scrollRef = useRef<ScrollView>(null);

  return (
    <>
      <ScrollView
        style={{ height: "50%" }}
        ref={scrollRef}
        onContentSizeChange={() => {
          scrollRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {chat?.map((value, index) => (
          <View key={index}>
            {showName(chat, value, index) ? (
              <View>
                <Text style={styles.counterpartView}>
                  {convertUIDtoUserName(value.sender_id)}(
                  {convertTimestampToTime(value.created_at)})
                </Text>
              </View>
            ) : (
              ""
            )}

            {TextElement(isMe(value.sender_id), value)}
          </View>
        ))}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  selfView: {
    alignItems: "flex-end",
    flexDirection: "row",
  },
  counterpartView: {
    alignItems: "flex-start",
  },
  leftAlignText: {
    color: "black",
  },
  rightAlign: {
    color: "black",
  },
});
