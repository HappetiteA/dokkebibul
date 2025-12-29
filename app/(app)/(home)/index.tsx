import {
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import { Link, useRouter } from "expo-router";
import NearbyUserViewer from "@/components/NearbyUserViewer";
import { useCallback, useMemo, useRef, useState } from "react";
import headerStyle from "@/components/style/headerStyle";
import ChatRoomList from "@/components/ChatRoomList";
import useModal from "@/hooks/useModal";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import ShadowWrap from "@/components/style/Shadow";
import {
  PlaceIcon,
  ProfilesIcon,
  SettingsIcon,
} from "@/components/style/Icons";

function DetailsModal({
  isOpen,
  onClose,
  name,
}: {
  isOpen: boolean;
  onClose: () => void;
  name: string | undefined;
}) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View>
        <View>
          <Text>{name}</Text>
          <Button title={"채팅방 나가기"} />
          <Button title={"차단하기"} />
          <Button title={"신고하기"} />
          <Button title={"확인"} onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default function MainScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%", "60%"], []);

  const { open: openDetailsModal, close: closeDetailsModal } =
    useModal(DetailsModal);

  const handleSheetChanges = useCallback((index: number) => {
    // console.log("handleSheetChanges", index);
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
          index={1}
        >
          <BottomSheetScrollView style={styles.contentContainer}>
            <ChatRoomList
              openModal={(name) =>
                openDetailsModal({ onClose: closeDetailsModal, name: name })
              }
            />
          </BottomSheetScrollView>
        </BottomSheet>
      </GestureHandlerRootView>
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
          <ShadowWrap>
            <TouchableOpacity
              style={headerStyle.button}
              onPress={onSettingsClick}
            >
              <PlaceIcon />
            </TouchableOpacity>
          </ShadowWrap>
        </View>
        <View style={headerStyle.right}>
          <ShadowWrap>
            <TouchableOpacity
              style={headerStyle.button}
              onPress={onSettingsClick}
            >
              <SettingsIcon />
            </TouchableOpacity>
          </ShadowWrap>
          <ShadowWrap>
            <TouchableOpacity
              style={headerStyle.button}
              onPress={onProfileClick}
            >
              <ProfilesIcon />
            </TouchableOpacity>
          </ShadowWrap>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F8F8FA",
  },
  contentContainer: {
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "#F8F8FA",
  },
});
