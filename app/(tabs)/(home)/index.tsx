import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import NearbyUserViewer from "@/components/NearbyUserViewer";
import ChatListElement from "@/components/ChatListElement";
import Modal from "@/components/Modal";
import { useState } from "react";

export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => {};

  return (
    <>
      <MainScreenHeader />
      <View style={styles.container}>
        <NearbyUserViewer />
        <Link href={"/chat/list"} asChild>
          <Text>Show Chat Room List</Text>
        </Link>
        <ScrollView style={styles.chatList}>
          {["asdf", "ewfd", "awegdv"].map((value, index) => (
            <ChatListElement
              id={value}
              key={index}
              onLongPress={() => {
                setModalOpen(true);
              }}
            />
          ))}
        </ScrollView>
      </View>

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
        }}
        children={
          <View>
            <Button title={"채팅방 나가기"} />
            <Button title={"차단하기"} />
            <Button title={"신고하기"} />
            <Button
              title={"확인"}
              onPress={() => {
                setModalOpen(false);
              }}
            />
          </View>
        }
      />
    </>
  );
}

function MainScreenHeader() {
  const router = useRouter();
  const onProfileClick = () => {
    router.navigate("/(tabs)/profile");
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          <Text>LOGO & TEXT</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerButton}>
            <Text>Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={onProfileClick}
          >
            <Text>Profile</Text>
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
  container: {
    flex: 1,
    alignItems: "center",
  },
  chatList: {
    width: "100%",
    paddingHorizontal: 10,
  },
});
