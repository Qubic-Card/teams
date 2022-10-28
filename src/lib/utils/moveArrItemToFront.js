const moveArrItemToFront = (data = [], uidTarget) => {
  const matchedData = data
    .filter((item) => item?.uid === uidTarget)
    .sort((a, b) => {
      if (a.member_id > b.member_id) {
        return 1;
      }
      if (a.member_id < b.member_id) {
        return -1;
      }
      return 0;
    });

  let unmatchedData = data
    .filter((item) => item?.uid !== uidTarget)
    .sort((a, b) => {
      if (a.member_id > b.member_id) {
        return 1;
      }
      if (a.member_id < b.member_id) {
        return -1;
      }
      return 0;
    });

  let emptyLogs = [];
  let nonEmptyLogs = [];

  unmatchedData.map((member) => {
    if (member.log_data) {
      nonEmptyLogs.push(member);
    } else {
      emptyLogs.push(member);
    }
  });

  let sortedDate = nonEmptyLogs
    .map((m) => m.created_at)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  let sortedMembers = [];

  sortedDate.map((date) => {
    let member = nonEmptyLogs.find((m) => m.created_at === date);
    sortedMembers.push(member);
  });

  let newData = [...matchedData, ...sortedMembers];

  return newData;
};

export default moveArrItemToFront;
