const sortCard = (data = [], uidTarget, sort) => {
  const matchedData = data
    .filter((item) => item.uid === uidTarget)
    .sort((a, b) => {
      if (
        new Date(a.datecreated).getTime() > new Date(b.datecreated).getTime()
      ) {
        return 1;
      }
      if (
        new Date(a.datecreated).getTime() < new Date(b.datecreated).getTime()
      ) {
        return -1;
      }
      return 0;
    });

  let unmatchedData = data
    .filter((item) => item.uid !== uidTarget)
    .sort((a, b) => {
      if (
        new Date(a.datecreated).getTime() > new Date(b.datecreated).getTime()
      ) {
        return 1;
      }
      if (
        new Date(a.datecreated).getTime() < new Date(b.datecreated).getTime()
      ) {
        return -1;
      }
      return 0;
    });

  let inactive = unmatchedData.filter((item) => item.status === null);
  let active = unmatchedData.filter((item) => item.status !== null);

  let sortedDate = [];

  if (sort === 'asc') {
    sortedDate = active
      .map((m) => m.datecreated)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  } else {
    sortedDate = active
      .map((m) => m.datecreated)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  let sortedMembers = [];

  sortedDate.map((date) => {
    let member = active.find((m) => m.datecreated === date);
    sortedMembers.push(member);
  });

  let newData = [...matchedData, ...sortedMembers, ...inactive];

  return newData;
};

export default sortCard;
