const moveArrItemToFront = (data = [], matchingId) => {
  const matchedData = data
    .filter((item) => item?.team_member_id?.uid === matchingId)
    .sort((a, b) => a.team_member_id.id + b.team_member_id.id);

  const unmatchedData = data
    .filter((item) => item?.team_member_id?.uid !== matchingId)
    .sort((a, b) => a.team_member_id.id + b.team_member_id.id);

  let newData = [...matchedData, ...unmatchedData];

  return newData;
};

export default moveArrItemToFront;
