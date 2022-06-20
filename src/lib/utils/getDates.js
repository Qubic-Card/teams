Date.prototype.addDays = function (days) {
  var date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};

const getDates = (startDate, stopDate) => {
  var dateArray = new Array();
  var currentDate = startDate;
  while (currentDate <= stopDate) {
    dateArray.push(new Date(currentDate).toDateString().slice(4));
    currentDate = currentDate.addDays(1);
  }
  return dateArray;
};

export const today = new Date().setDate(new Date().getDate());

export const last7Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 6)),
  today
);

export const last30Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 29)),
  today
);
export const last90Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 89)),
  today
);

export default getDates;
