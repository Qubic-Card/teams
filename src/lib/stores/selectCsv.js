import { writable } from 'svelte/store';

export const selectCsv = writable(null);

export const setSelectCsv = async (data) => await selectCsv.set(data);
