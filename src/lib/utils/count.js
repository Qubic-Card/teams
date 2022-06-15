const count = (days, data) => {
  let result = [];
  for (let i = 0; i < days.length; i++) {
    let count = 0;
    for (let j = 0; j < data.length; j++) {
      if (days[i] === data[j]) {
        count++;
      }
    }

    result.push(count);
  }
  return result;
};

export default count;
