import { writable } from 'svelte/store';

export const role = writable([]);
export const roleName = writable('');

export const setNewRole = (newRole) => role.set(newRole);
export const setRoleName = (newRoleName) => roleName.set(newRoleName);
