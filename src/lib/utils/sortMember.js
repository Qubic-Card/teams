const sortMember = (data = [], uidTarget, sort) => {
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
  let sortedDate = [];

  unmatchedData.map((member) => {
    if (member.log_data) {
      nonEmptyLogs.push(member);
    } else {
      emptyLogs.push(member);
    }
  });

  if (sort === 'asc') {
    sortedDate = nonEmptyLogs
      .map((m) => m.logged_at)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  } else {
    sortedDate = nonEmptyLogs
      .map((m) => m.logged_at)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }

  let sortedMembers = [];

  sortedDate.map((date) => {
    let member = nonEmptyLogs.find((m) => m.logged_at === date);
    sortedMembers.push(member);
  });

  let newData = [...matchedData, ...sortedMembers];

  return newData;
};

export default sortMember;
