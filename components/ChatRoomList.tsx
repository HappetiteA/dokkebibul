import { Button, View } from "react-native";
import ChatListElement from "./ChatListElement";
import { useEffect, useState } from "react";
import Modal from "./Modal";

interface IChatRoomListProp {
  setModalOpen: (arg0: boolean) => void;
}

export default function ChatRoomList({ setModalOpen }: IChatRoomListProp) {
  const [chatRoomInfo, setChatRoomInfo] = useState();

  useEffect(() => {}, []);

  return (
    <>
      {["asdf", "ewfd", "awegdv"].map((value, index) => (
        <ChatListElement
          id={value}
          key={index}
          onLongPress={() => {
            setModalOpen(true);
          }}
        />
      ))}
    </>
  );
}
