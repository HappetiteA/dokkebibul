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
  const now = new Date();

  // 날짜 비교를 위해 '시, 분, 초'를 0으로 맞춘 Date 객체 생성
  const targetDay = new Date(
    targetDate.getFullYear(),
    targetDate.getMonth(),
    targetDate.getDate(),
  );
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // getTime()을 사용하여 밀리초 단위로 변환 후 차이 계산
  const diffTime = today.getTime() - targetDay.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 1. 오늘인 경우 (차이가 0일)
  if (diffDays === 0) {
    let hours = targetDate.getHours();
    const minutes = String(targetDate.getMinutes()).padStart(2, "0");
    const ampm = hours < 12 ? "오전" : "오후";

    // 12시간제 변환 (0시는 12시로 표시)
    hours = hours % 12;
    hours = hours ? hours : 12;

    return `${ampm} ${hours}:${minutes}`;
  }

  // 2. 어제인 경우 (차이가 1일)
  if (diffDays === 1) {
    return "어제";
  }

  // 3. 그보다 과거인 경우 (MM월 DD일)
  const month = targetDate.getMonth() + 1;
  const date = targetDate.getDate();
  return `${month}월 ${date}일`;
};
