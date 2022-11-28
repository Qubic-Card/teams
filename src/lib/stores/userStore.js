import { writable } from 'svelte/store';

export const user = writable(null);
export const userData = writable([]);
export const userChangeTimestamp = writable(null);
export const memberData = writable({ id: 0, roleName: '', fullName: '' });

export const setUserData = (data) => userData.set(data);
