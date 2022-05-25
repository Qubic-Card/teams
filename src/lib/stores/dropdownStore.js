import { writable } from 'svelte/store';

export const dropdownVal = writable([
  '7 Days',
  '30 Days',
  '90 Days',
  'All time',
]);

export let selected = writable('7 Days');
