import {
  setLinks,
  setSocials,
  setTeamLinks,
  setTeamSocials,
} from '@lib/stores/editorStore';

import { toastSuccess } from './toast';

export const handleUpSocial = async (item, i, socials, isTeam = false) => {
  socials.splice(i, 1);
  socials.splice(i - 1, 0, item);
  isTeam ? setTeamSocials(socials) : setSocials(socials);
};
export const handleUpLink = async (item, i, links, isTeam = false) => {
  links.splice(i, 1);
  links.splice(i - 1, 0, item);
  isTeam ? setTeamLinks(links) : setLinks(links);
};

export const handleDeleteSocial = async (item, socials, isTeam = false) => {
  let arr = socials.filter((oldItem) => oldItem !== item);
  isTeam ? setTeamSocials(arr) : setSocials(arr);
  toastSuccess('Deleted successfully');
};

export const handleDeleteLink = async (item, links, isTeam = false) => {
  let arr = links.filter((oldItem) => oldItem !== item);
  isTeam ? setTeamLinks(arr) : setLinks(arr);
  toastSuccess('Deleted successfully');
};
