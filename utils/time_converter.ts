export const convertTimestampToTime = (timestamp: string): string => {
  const date = new Date(timestamp);

  var afternoon = date.getHours() > 12 ? "오후" : "오전";

  var hours = (date.getHours() % 12).toString();
  hours = hours.length == 1 ? "0" + hours : hours;

  var minutes = date.getMinutes().toString();
  minutes = minutes.length == 1 ? "0" + minutes : minutes;

  const timeString = afternoon + " " + hours + ":" + minutes;
  return timeString;
};

export const convertTimestampToDate = (timestamp: string): string => {
  const date = new Date(timestamp);

  var year = date.getFullYear().toString();

  var month = (date.getMonth() + 1).toString();

  var day = date.getDate().toString();

  const dateString = year + "년 " + month + "월 " + day + "일";
  return dateString;
};
