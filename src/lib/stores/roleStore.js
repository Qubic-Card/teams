import { writable } from 'svelte/store';

export const role = writable([]);

export const setNewRole = (newRole) => role.set(newRole);
