import { writable } from 'svelte/store';

export const profileData = writable(null);

export const teamData = writable({
  company: '',
  description: '',
  address: '',
  logo: '',
  email: '',
  phone: '',
  brochure: {
    url: '',
    title: '',
    filename: '',
  },
  avatar: '',
  socials: [],
  links: [],
  isShowMetaImage: false,
  design: {
    theme: 'dark',
    background: '',
  },
});

export const basicProfile = writable({
  firstname: '',
  lastname: '',
  firstnameBusiness: '',
  lastnameBusiness: '',
  job: '',
  jobBusiness: '',
  company: '',
  companyBusiness: '',
  avatar: '',
  address: '',
  addressBusiness: '',
  socials: [],
  links: [],
  isShowMetaImage: null,
  isBusiness: false,
  design: {
    theme: 'dark',
    background: '',
    backgroundBusiness: '',
  },
});

export const basicPersonalVcard = writable({
  firstname: '',
  lastname: '',
  address: '',
  company: '',
  job: '',
  avatar: '',
  design: {},
  socials: [],
  links: [],
  isBusiness: false,
});

export const basicBusinessVcard = writable({
  firstname: '',
  lastname: '',
  address: '',
  company: '',
  job: '',
  avatar: '',
  design: {},
  socials: [],
  links: [],
  isBusiness: false,
});
