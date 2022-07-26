import { writable } from 'svelte/store';

export const profileData = writable(null);

export const teamData = writable({
  company: '',
  description: '',
  address: '',
  logo: '',
  email: '',
  phone: '',
  brosur: '',
  avatar: '',
  socials: '',
  links: '',
  isShowMetaImage: false,
  design: {
    theme: 'dark',
    background: '',
  },
});
