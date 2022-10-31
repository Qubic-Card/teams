const getPercentage = (current, previous) => {
  const calc = current - previous;

  if (calc !== 0) {
    return Math.floor((calc / previous) * 100);
  } else {
    return 0;
  }
};

export default getPercentage;
