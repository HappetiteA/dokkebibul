export const convertTimestampToTime = (timestamp: string): string => {
  const date = new Date(timestamp);

  const hours24 = date.getHours();
  const minutes = date.getMinutes();

  const period = hours24 < 12 ? "오전" : "오후";
  const hours12 = hours24 % 12 == 0 ? 12 : hours24 % 12;

  const hh = hours12.toString().padStart(2, "0");
  const mm = minutes.toString().padStart(2, "0");

  return `${period} ${hh}:${mm}`;
};

export const convertTimestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  var year = date.getFullYear().toString();

  var month = (date.getMonth() + 1).toString();

  var day = date.getDate().toString();

  const dateString = year + "년 " + month + "월 " + day + "일";
  return dateString;
};
