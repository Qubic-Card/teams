export const count = (days, data) => {
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

export const tapCount = (socials, rawData) => {
  let result = [];
  for (let i = 0; i < socials.length; i++) {
    let count = 0;
    for (let j = 0; j < rawData.length; j++) {
      for (let k = 0; k < rawData[j].logs.length; k++) {
        if (rawData[j].logs[k].message.includes(socials[i])) {
          count++;
        }
      }
    }

    result.push(count);
  }
  return result;
};
