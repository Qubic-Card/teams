import { writable } from 'svelte/store';

const setMonth = (startDate, month) => {
  let endDate = new Date(startDate.setMonth(startDate.getMonth() + month));

  return endDate;
};

export const endDate = writable(setMonth(new Date(), 12));
