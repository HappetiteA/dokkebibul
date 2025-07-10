import { ChatLog } from "@/components/interfaces";

export const SampleChatData: ChatLog = [
  {
    date: "2025-07-07",
    chat: [
      { sender: "A", message: "Chat #1", time: "10:00", AIgenerated: false },
      { sender: "B", message: "Chat #2", time: "10:35", AIgenerated: true },
      { sender: "A", message: "Chat #3", time: "10:38", AIgenerated: false },
    ],
  },
  {
    date: "2025-07-08",
    chat: [
      { sender: "B", message: "Chat #4", time: "09:59", AIgenerated: true },
      { sender: "B", message: "Chat #5", time: "10:00", AIgenerated: true },
      { sender: "A", message: "Chat #6", time: "10:01", AIgenerated: false },
    ],
  },
  {
    date: "2025-07-09",
    chat: [
      { sender: "B", message: "Chat #7", time: "10:01", AIgenerated: true },
      { sender: "A", message: "Chat #8", time: "10:03", AIgenerated: false },
      { sender: "B", message: "Chat #9", time: "10:10", AIgenerated: false },
    ],
  },
];

export const SampleCoordinateData = {
  selfCoord: { lat: 37.1234, lon: 127.5678 },
  avatarCoordList: [
    { lat: 37.1239, lon: 127.5675 },
    { lat: 37.1236, lon: 127.568 },
    { lat: 37.1232, lon: 127.5679 },
    { lat: 37.1243, lon: 127.5681 },
    { lat: 37.123, lon: 127.5682 },
    { lat: 37.1237, lon: 127.567 },
  ],
};
