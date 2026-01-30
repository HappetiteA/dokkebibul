import {
  FlatList,
  Image,
  InteractionManager,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Message } from "@/types/model.types";
import { useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "@/utils/time_converter";
import { getAvatarSource } from "@/utils/avatarColor";
import { ChatRoomVM } from "./interfaces";

type Chat = Omit<Message, "conversation_id">;

interface ChatHistoryProp {
  chat?: Array<Chat>;
  chatRoomData: ChatRoomVM;
}
export default function ChatHistory({ chat, chatRoomData }: ChatHistoryProp) {
  chat = chat ?? [];

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

  const TextElement = (chat: Chat[], value: Chat, index: number) => {
    if (value.sender_id == chatRoomData.me.user_id) {
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
              marginLeft: 5,
            }}
          >
            {showName(chat, value, index) ? (
              <Image
                source={getAvatarSource(chatRoomData.other.color_code)}
                style={{ width: 40, height: 40 }}
                resizeMethod="resize"
              />
            ) : (
              <></>
            )}
          </View>
          <View>
            {showName(chat, value, index) ? (
              <View>
                <Text style={styles.otherName}>{chatRoomData.other.name}</Text>
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

  const renderItem = ({ item, index }: ListRenderItemInfo<Chat>) => {
    return (
      <View key={index}>
        {showDate(chat, item, index) ? (
          <View style={styles.timeText}>
            <Text style={{ color: "#96969D" }}>
              {convertTimestampToDate(item.created_at)}
            </Text>
          </View>
        ) : (
          ""
        )}

        {TextElement(chat, item, index)}
      </View>
    );
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

  const scrollRef = useRef<FlatList>(null);

  return (
    <FlatList
      data={chat}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ref={scrollRef}
      style={{ flex: 1, marginBottom: 10 }}
      inverted
      maintainVisibleContentPosition={{ minIndexForVisible: 0 }}
      contentContainerStyle={{ flexDirection: "column-reverse" }}
    ></FlatList>
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
