const setHours4Digit = (hours, minute) => {
  if (hours < 10) {
    hours = '0' + hours;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  return hours + ':' + minute;
};

export default setHours4Digit;
