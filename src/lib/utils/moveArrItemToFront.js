const moveArrItemToFront = (data = [], matchingId) => {
  //find the index of the element in the array

  const index = data.findIndex(
    (item) => item?.team_member_id?.uid === matchingId
  );

  if (index !== -1) {
    //if the matching element is found,
    const updatedData = [...data];
    //then remove that element and use `unshift`
    updatedData.unshift(...updatedData.splice(index, 1));
    return updatedData;
  }
  //if the matching element is not found, then return the same array
  return data;
};

export default moveArrItemToFront;
