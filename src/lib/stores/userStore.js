import { writable } from 'svelte/store';

export const user = writable(null);
export const userData = writable(null);
// export const permissions = writable({
//   readAnalytics: false,
//   writeAnalytics: false,
//   readBilling: false,
//   writeBilling: false,
//   readRoles: false,
//   writeRoles: false,
//   readMembers: false,
//   writeMembers: false,
//   readTeam: false,
//   writeTeam: false,
//   readConnections: false,
//   writeConnections: false,
// });

export const setUserData = (data) => userData.set(data);
