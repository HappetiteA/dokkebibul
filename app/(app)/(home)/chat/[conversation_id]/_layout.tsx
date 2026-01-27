import { Stack, useLocalSearchParams } from "expo-router";
import { ChatRoomProvider } from "@/contexts/ChatRoomProvider";

export default function Layout() {
  const { conversation_id } = useLocalSearchParams<{
    conversation_id: string;
  }>();

  return (
    <ChatRoomProvider conversation_id={conversation_id}>
      <Stack screenOptions={{ headerShown: false }} />
    </ChatRoomProvider>
  );
}
