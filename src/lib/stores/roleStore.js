import { writable } from 'svelte/store';

export const role = writable([]);
export const roleName = writable('');
export const teamRoles = writable(null);

export const setNewRole = (newRole) => role.set(newRole);
export const setRoleName = (newRoleName) => roleName.set(newRoleName);
