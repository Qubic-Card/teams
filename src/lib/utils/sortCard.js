const sortCard = (data = [], cidTarget, sort) => {
  const matchedData = data
    .filter((item) => item?.id === cidTarget)
    .sort((a, b) => {
      if (
        new Date(a.card[0].datecreated).getTime() >
        new Date(b.card[0].datecreated).getTime()
      ) {
        return 1;
      }
      if (
        new Date(a.card[0].datecreated).getTime() <
        new Date(b.card[0].datecreated).getTime()
      ) {
        return -1;
      }
      return 0;
    });

  let unmatchedData = data
    .filter((item) => item?.id !== cidTarget)
    .sort((a, b) => {
      if (
        new Date(a.card[0].datecreated).getTime() >
        new Date(b.card[0].datecreated).getTime()
      ) {
        return 1;
      }
      if (
        new Date(a.card[0].datecreated).getTime() <
        new Date(b.card[0].datecreated).getTime()
      ) {
        return -1;
      }
      return 0;
    });

  let sortedDate = [];

  if (sort === 'asc') {
    sortedDate = unmatchedData
      .map((m) => m.card[0].datecreated)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  } else {
    sortedDate = unmatchedData
      .map((m) => m.card[0].datecreated)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }
  let sortedMembers = [];

  sortedDate.map((date) => {
    let member = unmatchedData.find((m) => m.card[0].datecreated === date);
    sortedMembers.push(member);
  });

  let newData = [...matchedData, ...sortedMembers];

  return newData;
};

export default sortCard;
