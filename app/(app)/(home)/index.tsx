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
import Modal from "@/components/ModalChain";
import { useCallback, useMemo, useRef, useState } from "react";
import headerStyle from "@/components/style/headerStyle";
import ChatRoomList from "@/components/ChatRoomList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";

export default function MainScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "50%", "90%"], []);

  const [modalOpen, setModalOpen] = useState(false);
  const onModalOpen = () => {};

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  return (
    <>
      <MainScreenHeader />
      <GestureHandlerRootView style={styles.container}>
        <NearbyUserViewer />

        <BottomSheet
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
          snapPoints={snapPoints}
          index={2}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            <Text>채팅방 목록</Text>
            <ChatRoomList setModalOpen={setModalOpen} />
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>

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
  contentContainer: {
    width: "100%",
    paddingHorizontal: 10,
  },
});
