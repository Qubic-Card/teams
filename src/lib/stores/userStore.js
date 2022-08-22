import { writable } from 'svelte/store';

export const user = writable(null);
export const userData = writable([]);
export const userChangeTimestamp = writable(null);
export const memberData = writable({ id: 0, roleName: '' });
// export const permissions = writable({
//   readAnalytics: false,
//   readBilling: false,
//   writeBilling: false,
//   readRoles: false,
//   writeRoles: false,
//   readMembers: false,
//   writeMembers: false,
//   readTeam: false,
//   writeTeam: false,
//   readConnections: false,
//   writeRecords: false,
//   writeProfile: false,
// });

export const setUserData = (data) => userData.set(data);
