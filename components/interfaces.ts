export type ChatLog = Array<DailyChat>;

export interface DailyChat {
  date: string;
  chat: Array<SingleChat>;
}

export interface SingleChat {
  sender: string;
  message: string;
  time: string;
  AIgenerated: boolean;
}
