import { writable } from 'svelte/store';

export const teams = writable({
  subscription_end_date: '',
  member_count: 0,
});

export const teamData = writable({
  name: '',
  id: '',
  logo: '',
  subscription_end_date: '',
  member_count: 0,
});
