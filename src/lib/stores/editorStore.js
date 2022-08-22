import { writable } from 'svelte/store';

export const socials = writable([]);
export const links = writable([]);

export const teamSocials = writable([]);
export const teamLinks = writable([]);

export const isDisplayPersonal = writable(false);

export const setSocials = (updatedSocials) => socials.set(updatedSocials);
export const setLinks = (updatedLinks) => links.set(updatedLinks);
export const setTeamSocials = (updatedSocials) =>
  teamSocials.set(updatedSocials);
export const setTeamLinks = (updatedLinks) => teamLinks.set(updatedLinks);
