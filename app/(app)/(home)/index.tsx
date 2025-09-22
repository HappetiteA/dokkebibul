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
import headerStyle from "@/components/style/headerStyle";
import ChatRoomList from "@/components/ChatRoomList";

export default function MainScreen() {
  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => {};

  return (
    <>
      <MainScreenHeader />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <NearbyUserViewer />
          <ChatRoomList setModalOpen={setModalOpen} />
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
      ></Modal>
    </>
  );
}

function MainScreenHeader() {
  const router = useRouter();
  const onProfileClick = () => {
    router.navigate("/(app)/(home)/MyProfile");
  };

  const onSettingsClick = () => {
    router.navigate("/(app)/(home)/Settings");
  };

  return (
    <View style={headerStyle.container}>
      <View style={headerStyle.content}>
        <View style={headerStyle.left}>
          <Text>LOGO & TEXT</Text>
        </View>
        <View style={headerStyle.right}>
          <TouchableOpacity
            style={headerStyle.button}
            onPress={onSettingsClick}
          >
            <Text>Setting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={headerStyle.button} onPress={onProfileClick}>
            <Text>Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
    paddingHorizontal: 10,
  },
});
