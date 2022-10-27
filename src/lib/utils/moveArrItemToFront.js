const moveArrItemToFront = (data = [], matchingId) => {
  const matchedData = data
    .filter((item) => item?.team_cardcon[0]?.team_member_id?.uid === matchingId)

    .sort((a, b) => {
      if (
        a.team_cardcon[0]?.team_member_id.id >
        b.team_cardcon[0]?.team_member_id.id
      ) {
        return 1;
      }
      if (
        a.team_cardcon[0]?.team_member_id.id <
        b.team_cardcon[0]?.team_member_id.id
      ) {
        return -1;
      }
      return 0;
    });

  let unmatchedData = data
    .filter((item) => item?.team_cardcon[0]?.team_member_id?.uid !== matchingId)
    .sort((a, b) => {
      if (
        a.team_cardcon[0]?.team_member_id.id >
        b.team_cardcon[0]?.team_member_id.id
      ) {
        return 1;
      }
      if (
        a.team_cardcon[0]?.team_member_id.id <
        b.team_cardcon[0]?.team_member_id.id
      ) {
        return -1;
      }
      return 0;
    });

  // let emptyLogs = [];
  // let nonEmptyLogs = [];

  // unmatchedData.map((member) => {
  //   if (member.team_logs.length > 0) {
  //     nonEmptyLogs.push(member);
  //   } else {
  //     emptyLogs.push(member);
  //   }
  // });

  // let sortedDate = nonEmptyLogs
  //   .map((m) => m.team_logs[0].created_at)
  //   .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  // let sortedMembers = [];

  // sortedDate.map((date) => {
  //   let member = nonEmptyLogs.find((m) => m.team_logs[0].created_at === date);
  //   sortedMembers.push(member);
  // });

  console.log(unmatchedData);

  let newData = [...matchedData, ...unmatchedData];

  return newData;
};

export default moveArrItemToFront;
