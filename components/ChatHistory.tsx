import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { Message } from "@/types/model.types";
import { useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "@/utils/time_converter";

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
          maxWidth: 250,
          backgroundColor: color,
          padding: 8,
          marginVertical: 5,
          marginHorizontal: 5,
          borderRadius: 15,
        }}
      >
        <Text style={{ textAlign: "justify", fontSize: 16 }}>
          {value.content}
        </Text>
      </View>
    );
  };

  const TextElement = (
    chat: Chat[],
    value: Chat,
    index: number,
    isMe: boolean
  ) => {
    if (isMe) {
      //Right Aligned
      return (
        <View key={index} style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginTop: "auto", color: "#909090" }}>
              {convertTimestampToTime(value.created_at)}
            </Text>
            {TextBox(value, "#99D8EE")}
          </View>
        </View>
      );
    } else {
      // Left Aligned
      return (
        <View key={index} style={{ flexDirection: "row" }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: showName(chat, value, index)
                ? "red"
                : "transparent",
              marginLeft: 5,
            }}
          ></View>
          <View>
            {showName(chat, value, index) ? (
              <View>
                <Text style={styles.otherName}>
                  {convertUIDtoUserName(value.sender_id)}
                </Text>
              </View>
            ) : (
              ""
            )}
            <View style={{ flexDirection: "row" }}>
              <View style={{ flexDirection: "row" }}>
                {TextBox(value, "#E4E4EA")}
                <Text style={{ marginTop: "auto", color: "#909090" }}>
                  {convertTimestampToTime(value.created_at)}
                </Text>
              </View>
              <View style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      );
    }
  };

  const convertUIDtoUserName = (user_id: string) => {
    var idx = user_ids.findIndex((value) => value == user_id);
    return user_names[idx];
  };

  const isMe = (id: string) => {
    return id == profile?.user_id;
  };

  const showName = (chat: Chat[], value: Chat, index: number) => {
    //if (isMe(value.sender_id)) return false;
    if (index == 0) return true;
    return value.sender_id != chat[index - 1].sender_id;
  };

  const showDate = (chat: Chat[], value: Chat, index: number) => {
    //if (isMe(value.sender_id)) return false;
    if (index == 0) return true;
    return (
      convertTimestampToDate(value.created_at) !=
      convertTimestampToDate(chat[index - 1].created_at)
    );
  };

  const scrollRef = useRef<ScrollView>(null);

  return (
    <>
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => {
          scrollRef.current?.scrollToEnd({ animated: false });
        }}
      >
        {chat?.map((value, index) => (
          <View key={index}>
            {showDate(chat, value, index) ? (
              <View style={styles.timeText}>
                <Text style={{ color: "#96969D" }}>
                  {convertTimestampToDate(value.created_at)}
                </Text>
              </View>
            ) : (
              ""
            )}

            {TextElement(chat, value, index, isMe(value.sender_id))}
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
  timeText: {
    marginVertical: 10,
    marginHorizontal: "auto",
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: "#E4E4EA",
  },
  otherName: {
    alignItems: "flex-start",
    marginHorizontal: 5,
    fontSize: 20,
  },
  leftAlignText: {
    color: "black",
  },
  rightAlign: {
    color: "black",
  },
});
