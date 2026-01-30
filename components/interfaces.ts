import { ChatRoom } from "@/types/model.types";

export type ChatSettingUpdate = {
  user1_ai_enabled?: boolean;
  user1_chat_enabled?: boolean;
  user1_noti_enabled?: boolean;
  user2_ai_enabled?: boolean;
  user2_chat_enabled?: boolean;
  user2_noti_enabled?: boolean;
};

export type ChatRoomVM = {
  id: string;
  created_at: string;
  last_msg: string;
  last_msg_created_at: string;

  me: {
    user_id: string;
    name: string;
    color_code: number;

    ai_enabled: boolean;
    noti_enabled: boolean;

    chat_enabled: boolean;
  };
  other: {
    user_id: string;
    name: string;
    color_code: number;

    ai_enabled: boolean;
    noti_enabled: boolean;

    chat_enabled: boolean;
  };
};

export const toChatRoomVM = (
  data: ChatRoom | undefined,
  myId: string | undefined,
): ChatRoomVM | undefined => {
  if (!data || !myId) {
    return undefined;
  }

  const isUser1 = data.user1_id === myId;

  const user1 = {
    user_id: data.user1_id,
    name: data.user1_name,
    color_code: data.user1_color_code,
    ai_enabled: data.user1_ai_enabled,
    noti_enabled: data.user1_noti_enabled,
    chat_enabled: data.user1_chat_enabled,
  };

  const user2 = {
    user_id: data.user2_id,
    name: data.user2_name,
    color_code: data.user2_color_code,
    ai_enabled: data.user2_ai_enabled,
    noti_enabled: data.user2_noti_enabled,
    chat_enabled: data.user2_chat_enabled,
  };

  return {
    id: data.id,
    created_at: data.created_at,
    last_msg: data.last_msg,
    last_msg_created_at: data.last_msg_created_at,
    me: isUser1 ? user1 : user2,
    other: isUser1 ? user2 : user1,
  };
};

export const toChatRoom = (vm: ChatRoomVM): ChatRoom => {
  const isMeUser1 = vm.me.user_id <= vm.other.user_id;

  const u1 = isMeUser1 ? vm.me : vm.other;
  const u2 = isMeUser1 ? vm.other : vm.me;

  return {
    id: vm.id,

    // 서버에서 관리하는 값은 여기선 비워두거나 유지용으로 채워야 함
    created_at: vm.created_at,
    last_msg: vm.last_msg,
    last_msg_created_at: vm.last_msg_created_at,

    user1_id: u1.user_id,
    user1_name: u1.name,
    user1_color_code: u1.color_code,
    user1_ai_enabled: u1.ai_enabled,
    user1_noti_enabled: u1.noti_enabled,
    user1_chat_enabled: u1.chat_enabled,

    user2_id: u2.user_id,
    user2_name: u2.name,
    user2_color_code: u2.color_code,
    user2_ai_enabled: u2.ai_enabled,
    user2_noti_enabled: u2.noti_enabled,
    user2_chat_enabled: u2.chat_enabled,
  };
};

export interface GlobalSetting {
  ai_enabled: boolean;
  noti_enabled: boolean;
}
