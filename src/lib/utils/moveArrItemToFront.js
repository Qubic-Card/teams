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

  const unmatchedData = data
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

  let newData = [...matchedData, ...unmatchedData];

  return newData;
};

export default moveArrItemToFront;
