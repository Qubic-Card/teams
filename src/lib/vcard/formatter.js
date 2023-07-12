import isIOS from '@lib/utils/checkDevice';

const nl = () => '\n';

const checkIsLink = (val) => {
  if (val.includes('http') || val.includes('https') || val.includes('www')) {
    return true;
  } else return false;
};

const formatter = (vcard) => {
  const startVcard = vcard.split('\n').filter((e) => e.includes('BEGIN:VCARD'));
  const endVcard = vcard.split('\n').filter((e) => e.includes('END:VCARD'));
  let photo = vcard.split('\n').filter((e) => e.includes('PHOTO;'));
  let photoFormatter = '';

  if (photo.length > 0) {
    photo = photo[0].split(',');
    photo.shift();
    photoFormatter = Object.assign([], {
      0: 'PHOTO;ENCODING=b;TYPE=JPEG:',
      1: photo[0],
    }).join('');
  }

  const others = vcard
    .split('\n')
    .filter(
      (e) =>
        !e.includes('BEGIN:VCARD') &&
        !e.includes('END:VCARD') &&
        !e.includes('X-SOCIALPROFILE') &&
        !e.includes('PHOTO;')
    );
  let socialsFormatted = vcard
    .split('\n')
    .filter((e) => e.includes('X-SOCIALPROFILE'));

  for (let idx in socialsFormatted) {
    let username = socialsFormatted[idx].split(':')[1];
    let http = socialsFormatted[idx].split(':')[1];
    let url = socialsFormatted[idx].split(':')[2];
    let title = socialsFormatted[idx]?.split('=')[1].split(':')[0];
    let link = socialsFormatted[idx]?.split(':')[1];
    let isCompany = socialsFormatted[idx].includes('cmpny');
    let domain = socialsFormatted[idx].split(':')[2];

    const socialFormatter = (val, titleCompany, title, link) => {
      val = `URL;LABEL=${isCompany ? titleCompany : title}:${link}`;
      return val;
    };

    const linkFormatter = () => {
      socialsFormatted[idx] = `URL;LABEL=${title.slice(0, -1)}:${
        link.includes('http') ? http + ':' + domain : link
      }`;
    };

    const iOSSocialFormatter = (val, titleCompany, title, link, idx) => {
      val = `item${idx - 17}.URL;LABEL=${
        isCompany ? titleCompany : title
      }:${link} ${nl()}item${idx - 17}.X-ABLabel:${
        isCompany ? titleCompany : title
      }`;

      return val;
    };

    const iOSLinkFormatter = (idx) => {
      socialsFormatted[idx] = `item${idx - 17}.URL;LABEL=${title.slice(
        0,
        -1
      )}:${link.includes('http') ? http + ':' + domain : link} ${nl()}item${
        idx - 17
      }.X-ABLabel:${title.slice(0, -1)}`;
    };

    if (isIOS()) {
      if (socialsFormatted[idx].includes('facebook')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Facebook',
            'Facebook',
            `https://facebook.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('telegram')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Telegram',
            'Telegram',
            `https://t.me/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('discord')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Discord',
            'Discord',
            `https://discord.gg/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('threads')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Threads',
            'Threads',
            `https://threads.net/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('instagram')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Instagram',
            'Instagram',
            `https://instagram.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('twitter')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Twitter',
            'Twitter',
            `https://twitter.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('linkedin')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company LinkedIn',
            'LinkedIn',
            `https://linkedin.com/in/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('youtube')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company YouTube',
            'YouTube',
            `https://youtube.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('whatsapp')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company WhatsApp',
            'WhatsApp',
            `https://wa.me/${username.replace('+', '')}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('github')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company GitHub',
            'GitHub',
            `https://github.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('tiktok')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company TikTok',
            'TikTok',
            `https://tiktok.com/${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('line')) {
        if (checkIsLink(socialsFormatted[idx])) {
          iOSLinkFormatter(idx);
        } else {
          socialsFormatted[idx] = iOSSocialFormatter(
            socialsFormatted[idx],
            'Company Line',
            'Line',
            `https://line.me/R/ti/p/~${username}`,
            idx
          );
        }
      } else if (socialsFormatted[idx].includes('email')) {
        socialsFormatted[idx] = '';
      } else {
        iOSLinkFormatter(idx);
      }
    } else {
      if (socialsFormatted[idx].includes('facebook')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Facebook',
            'Facebook',
            `https://facebook.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('telegram')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Telegram',
            'Telegram',
            `https://t.me/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('discord')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Discord',
            'Discord',
            `https://discord.gg/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('instagram')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Instagram',
            'Instagram',
            `https://instagram.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('twitter')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Twitter',
            'Twitter',
            `https://twitter.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('linkedin')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company LinkedIn',
            'LinkedIn',
            `https://linkedin.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('youtube')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company YouTube',
            'YouTube',
            `https://youtube.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('whatsapp')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company WhatsApp',
            'WhatsApp',
            `https://wa.me/${username.replace('+', '')}`
          );
        }
      } else if (socialsFormatted[idx].includes('github')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Github',
            'Github',
            `https://github.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('tiktok')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company TikTok',
            'TikTok',
            `https://tiktok.com/${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('line')) {
        if (checkIsLink(socialsFormatted[idx])) {
          linkFormatter();
        } else {
          socialsFormatted[idx] = socialFormatter(
            socialsFormatted[idx],
            'Company Line',
            'Line',
            `https://line.me/R/ti/p/~${username}`
          );
        }
      } else if (socialsFormatted[idx].includes('email')) {
        socialsFormatted[idx] = '';
      } else {
        linkFormatter();
      }
    }
  }

  socialsFormatted = socialsFormatted.sort((a, b) => a.localeCompare(b));

  const formatted = [
    ...startVcard,
    ...[photoFormatter],
    ...others,
    ...socialsFormatted,
    ...endVcard,
  ];

  return formatted.join(nl());
};

export default formatter;
