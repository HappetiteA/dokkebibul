import { ChatRoomVM } from "@/components/interfaces";
import { createContext, useContext } from "react";

export type ChatRoomContextValue = {
  chatRoomData?: ChatRoomVM;
  setChatRoomData: React.Dispatch<React.SetStateAction<ChatRoomVM | undefined>>;
  setAIenabled: (value: boolean) => void;
  setNotiEnabled: (value: boolean) => void;
  setChatEnabled: (value: boolean) => void;
};

export const ChatRoomContext = createContext<ChatRoomContextValue | null>(null);

export function useChatRoom() {
  const ctx = useContext(ChatRoomContext);
  if (!ctx) throw new Error("useChatRoom must be used within ChatRoomProvider");
  return ctx;
}
