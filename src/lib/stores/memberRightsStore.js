import { writable } from 'svelte/store';

export const memberRights = writable([]);
export const setMemberRights = (rights) => memberRights.set(rights);
