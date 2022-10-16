import { writable } from 'svelte/store';

export const inView = writable(true);
export const isInViewTriggered = writable(false);
