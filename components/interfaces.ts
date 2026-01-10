import { ChatRoom } from "@/types/model.types";

export type ChatRoomDatas = Map<string, Omit<ChatRoom, "id">>;

export interface IGlobalSetting {
  AIenabled: boolean;
  last_fetched: number;
}
