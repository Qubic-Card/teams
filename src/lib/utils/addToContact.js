import { VCard } from '@covve/easy-vcard';
import formatter from '@lib/vcard/formatter';
import download from '@lib/utils/download';
import getBase64FromUrl from '@lib/utils/getBase64';
import isIOS from '@lib/utils/checkDevice';

let phoneNumber = null;
let imageBase64 = null;

const addToContactHandler = (profile) => {
  if (profile.socials)
    profile.socials.map((social) => {
      if (social.type === 'phone') {
        phoneNumber = social.data;
        if (phoneNumber.startsWith('+')) phoneNumber = phoneNumber.slice(1);
        if (phoneNumber.startsWith('0')) {
          phoneNumber = phoneNumber.slice(1);
          phoneNumber = '62' + phoneNumber;
        }
      }
    });

  getBase64FromUrl(profile.avatar).then((base64) => (imageBase64 = base64));

  let vcard = new VCard();
  vcard
    .setFullName(`${profile.firstname} ${profile.lastname}`)
    .addFirstName(`${profile.firstname}`)
    .addLastName(`${profile.lastname}`)
    .addTitle(`${profile.job}`)
    .addOrganization(`${profile.company}`, [])
    .addPhoto(imageBase64);
  if (profile.firstname) {
    if (profile.socials)
      profile.socials.map((social) => {
        if (social.type === 'facebook') {
          vcard.addUrl(`https://facebook.com/${social.data}`, {
            label: 'Facebook',
          });
        }
        if (social.type === 'twitter') {
          vcard.addUrl(`https://twitter.com/${social.data}`, {
            label: 'Twitter',
          });
        }
        if (social.type === 'instagram') {
          vcard.addUrl(`https://instagram.com/${social.data}`, {
            label: 'Instagram',
          });
        }
        if (social.type === 'linkedin') {
          vcard.addUrl(`https://linkedin.com/in/${social.data}`, {
            label: 'LinkedIn',
          });
        }
        if (social.type === 'tiktok') {
          vcard.addUrl(`https://tiktok.com/${social.data}`, {
            label: 'TikTok',
          });
        }
        if (social.type === 'youtube') {
          vcard.addUrl(`https://youtube.com/${social.data}`, {
            label: 'YouTube',
          });
        }
        if (social.type === 'whatsapp') {
          vcard.addUrl(`https://wa.me/${social.data.split('+')}`, {
            label: 'WhatsApp',
          });
          if (social.data !== phoneNumber) {
            vcard.addPhone(`+${social.data}`);
          }
        }
        if (social.type === 'line') {
          vcard.addUrl(`https://line.me/R/ti/p/~${social.data}`, {
            label: 'Line',
          });
        }
        if (social.type === 'email') {
          vcard.addEmail(`${social.data}`);
        }
        if (social.type === 'phone') {
          vcard.addPhone(`${social.data}`);
        }
      });
    profile.links.map((link) => {
      vcard.addUrl(`${link.link}`, {
        label: `${link.title}`,
      });
    });
  }

  const formattedText = vcard.toVcard(true);
  const iosFormattedText = formatter(
    vcard.toString(),
    true,
    profile.socials,
    profile.links
  );
  const androidFormattedText = formatter(formattedText, false);

  download(isIOS() ? iosFormattedText : androidFormattedText, `qubicContact`);
};

export default addToContactHandler;
