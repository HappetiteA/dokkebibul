import {
  FlatList,
  Image,
  InteractionManager,
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Message } from "@/types/model.types";
import { useEffect, useMemo, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  convertTimestampToDate,
  convertTimestampToTime,
} from "@/utils/time_converter";
import { getAvatarSource } from "@/utils/avatarColor";
import { ChatRoomVM } from "./interfaces";
import { Text } from "@/components/Text";

type Chat = Omit<Message, "conversation_id">;

interface ChatHistoryProp {
  chat?: Array<Chat>;
  chatRoomData: ChatRoomVM;
}
export default function SelfChatHistory({
  chat,
  chatRoomData,
}: ChatHistoryProp) {
  chat = chat ?? [];

  const showName = (chat: Chat[], value: Chat, index: number) => {
    //if (isMe(value.sender_id)) return false;
    if (index == chat.length - 1) return true;
    return value.is_human != chat[index + 1].is_human;
  };

  const hasRightBottomTail = (chat: Chat[], value: Chat, index: number) => {
    if (index == 0) return true;

    const differentSender = value.is_human != chat[index - 1].is_human;
    const differentDay =
      convertTimestampToDate(value.created_at) !=
      convertTimestampToDate(chat[index - 1].created_at);
    return differentSender || differentDay;
  };

  const showDate = (chat: Chat[], value: Chat, index: number) => {
    //if (isMe(value.sender_id)) return false;
    if (index == chat.length - 1) return true;
    return (
      convertTimestampToDate(value.created_at) !=
      convertTimestampToDate(chat[index + 1].created_at)
    );
  };

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
    if (value.is_human) {
      //Right Aligned
      const HasRightBottomTail = hasRightBottomTail(chat, value, index);
      const BGcolor =
        chatRoomData.me.ai_enabled && !value.is_human ? "#C5EDD2" : "#99D8EE";

      return (
        <View key={index} style={{ flexDirection: "row" }}>
          <View style={{ flex: 1 }} />
          <View style={{ flexDirection: "row" }}>
            {HasRightBottomTail ? (
              <View
                style={[
                  styles.rightTail,
                  {
                    backgroundColor: BGcolor,
                  },
                ]}
              ></View>
            ) : (
              <></>
            )}
            <Text style={{ marginTop: "auto", color: "#909090" }}>
              {convertTimestampToTime(value.created_at)}
            </Text>
            {TextBox(value, BGcolor)}
          </View>
        </View>
      );
    } else {
      // Left Aligned
      const ShowDate = showDate(chat, value, index);
      const ShowName = showName(chat, value, index) || ShowDate;
      const HasLeftTopTail = ShowName;
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
            {ShowName ? (
              <Image
                source={getAvatarSource(chatRoomData.other.color_code)}
                style={{ width: 40, height: 40, backgroundColor: "#f8f8fa" }}
                resizeMethod="resize"
              />
            ) : (
              <></>
            )}
          </View>
          <View>
            {ShowName ? (
              <Text style={styles.otherName}>{"도깨비불"}</Text>
            ) : (
              <></>
            )}
            <View style={{ flexDirection: "row" }}>
              {HasLeftTopTail ? <View style={styles.leftTail}></View> : <></>}
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
        {showDate(reversedChat, item, index) ? (
          <View style={styles.timeText}>
            <Text style={{ color: "#96969D" }}>
              {convertTimestampToDate(item.created_at)}
            </Text>
          </View>
        ) : (
          <></>
        )}

        {TextElement(reversedChat, item, index)}
      </View>
    );
  };

  const scrollRef = useRef<FlatList>(null);
  const reversedChat = useMemo(() => {
    return chat.slice().reverse();
  }, [chat]);

  return (
    <FlatList
      data={reversedChat}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      ref={scrollRef}
      style={{ flex: 1, marginBottom: 10 }}
      inverted
      maintainVisibleContentPosition={{
        minIndexForVisible: 0,
        autoscrollToTopThreshold: 80,
      }}
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

  // Design Detail
  leftTail: {
    position: "absolute",
    top: 5,
    left: 5,
    width: 15,
    height: 15,
    backgroundColor: "#E4E4EA",
  },

  rightTail: {
    position: "absolute",
    right: 5,
    bottom: 5,
    width: 15,
    height: 15,
    backgroundColor: "#E4E4EA",
  },
});
