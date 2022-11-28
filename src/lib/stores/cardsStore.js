import { writable } from 'svelte/store';
import Cookies from 'js-cookie';

export const cards = writable(Cookies.get("card"));