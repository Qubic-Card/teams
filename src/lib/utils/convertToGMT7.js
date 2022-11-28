const convertToGMT7 = (date) => {
  let tz = new Date().getTimezoneOffset() / 60;
  date = new Date(new Date(date).setHours(new Date(date).getHours() - tz));

  return date;
};

export default convertToGMT7;
