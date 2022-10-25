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

// INFO: FOR PERCENTAGE
export const sevenDaysAgo = new Date().setDate(new Date().getDate() - 6);
export const threeDaysAgo = new Date().setDate(new Date().getDate() - 2);
export const fourteenDaysAgo = new Date().setDate(new Date().getDate() - 13);
export const thirtyDaysAgo = new Date().setDate(new Date().getDate() - 29);

export const last3Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 2)),
  today
);

export const last7Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 6)),
  today
);

export const last14Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 13)),
  today
);

export const last28Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 27)),
  today
);

export const last30Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 30)),
  today
);

export const last60Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 59)),
  today
);

export const last90Days = getDates(
  new Date(new Date().setDate(new Date().getDate() - 89)),
  today
);

export const last1Year = getDates(
  new Date(new Date().setDate(new Date().getDate() - 364)),
  today
);

// INFO: FOR PERCENTAGE
export const sevenDays = getDates(
  new Date(new Date().setDate(new Date().getDate() - 13)),
  sevenDaysAgo
);

export const threeDays = getDates(
  new Date(new Date().setDate(new Date().getDate() - 5)),
  threeDaysAgo
);

export const fourteenDays = getDates(
  new Date(new Date().setDate(new Date().getDate() - 27)),
  fourteenDaysAgo
);

export const thirtyDays = getDates(
  new Date(new Date().setDate(new Date().getDate() - 59)),
  thirtyDaysAgo
);

export const formatDate = (dateArg) => {
  const date = new Date(dateArg).getDate();
  const month = new Date(dateArg).getMonth() + 1;
  const year = new Date(dateArg).getFullYear();
  const formattedDate = `${date < 10 ? '0' + date : date}${
    month < 10 ? '0' + month : month
  }${year}`;
  return formattedDate;
};

export default getDates;
