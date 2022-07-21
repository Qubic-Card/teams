import { writable } from 'svelte/store';

export const profileData = writable(null);

export const teamData = writable({
  company: '',
  description: '',
  address: '',
  logo: '',
  email: '',
  phone: '',
  avatar: '',
  socials: '',
  links: '',
  design: {
    theme: 'dark',
    background: '',
  },
});
