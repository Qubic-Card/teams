import { writable } from 'svelte/store';

export const selectedProfileMenu = writable('Transfer with current profile');
export const selectedAddress = writable({
  choosen: 0,
  email: '',
});
