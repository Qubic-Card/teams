import { basicLinks, basicSocials } from '@lib/stores/editorStore';
import { toastFailed, toastSuccess } from '@lib/utils/toast';

import { profileData } from '@lib/stores/profileData';

export const addLink = (isBusiness, links) => {
  if (isBusiness) {
    links.filter((link) => link.isPersonal === false).length < 5
      ? basicLinks.set([
          {
            title: 'My Website',
            link: 'https://qubic.id',
            isActive: true,
            isPersonal: false,
          },
          ...links,
        ])
      : toastFailed('Only 5 link allowed for free members');
  } else {
    links.filter((link) => link.isPersonal !== false).length < 5
      ? basicLinks.set([
          {
            title: 'My Website',
            link: 'https://qubic.id',
            isActive: true,
            isPersonal: true,
          },
          ...links,
        ])
      : toastFailed('Only 5 link allowed for free members');
  }
};

export const handleUpSocial = async (item, i, socials, isBusiness) => {
  let socialsBusiness = socials.filter((social) =>
    social.type.includes('business')
  );
  let socialsPersonal = socials.filter(
    (social) => !social.type.includes('business')
  );
  if (isBusiness) {
    socialsBusiness.splice(i, 1);
    socialsBusiness.splice(i - 1, 0, item);
    socials = [...socialsBusiness, ...socialsPersonal];
    basicSocials.set(socials);
  } else {
    socialsPersonal.splice(i, 1);
    socialsPersonal.splice(i - 1, 0, item);
    socials = [...socialsPersonal, ...socialsBusiness];
    basicSocials.set(socials);
  }
};

export const handleUpLink = async (item, i, links, isPersonal) => {
  let linksBusiness = links.filter((link) => link.isPersonal === false);
  let linksPersonal = links.filter((link) => link.isPersonal !== false);

  if (isPersonal) {
    linksPersonal.splice(i, 1);
    linksPersonal.splice(i - 1, 0, item);

    links = [...linksPersonal, ...linksBusiness];
    basicLinks.set(links);
  } else {
    linksBusiness.splice(i, 1);
    linksBusiness.splice(i - 1, 0, item);

    links = [...linksBusiness, ...linksPersonal];
    basicLinks.set(links);
  }
};

export const handleDeleteSocial = async (item, socials) => {
  let arr = socials.filter((oldItem) => oldItem !== item);
  basicSocials.set(arr);
  toastSuccess('Deleted successfully');
};

export const handleDeleteLink = async (item, links) => {
  let arr = links.filter((oldItem) => oldItem !== item);
  basicLinks.set(arr);
  toastSuccess('Deleted successfully');
};
