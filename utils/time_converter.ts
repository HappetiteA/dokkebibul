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

export const formatTimestamp = (timestamp: string): string => {
  const targetDate = new Date(timestamp);
  if (isNaN(targetDate.getTime())) return "";

  const now = new Date();

  // 시간 정보를 제거한 순수 '날짜' 객체들
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  // Date 객체의 자동 연산(Rollover) 활용
  const yesterday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - 1,
  );

  const targetTime = targetDay.getTime();

  if (targetTime === today.getTime()) {
    let hours = targetDate.getHours();
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";
    hours = hours % 12 || 12;
    return `${ampm} ${hours}:${minutes}`;
  }

  if (targetTime === yesterday.getTime()) {
    return "어제";
  }

  return `${targetDate.getMonth() + 1}월 ${targetDate.getDate()}일`;
};
