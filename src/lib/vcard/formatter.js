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
  const others = vcard
    .split('\n')
    .filter(
      (e) =>
        !e.includes('BEGIN:VCARD') &&
        !e.includes('END:VCARD') &&
        !e.includes('X-SOCIALPROFILE')
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
      socialsFormatted[idx] = `URL;LABEL=${title}:${
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
      socialsFormatted[idx] = `item${idx - 17}.URL;LABEL=${title}:${
        link.includes('http') ? http + ':' + domain : link
      } ${nl()}item${idx - 17}.X-ABLabel:${title}`;
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
    ...others,
    ...socialsFormatted,
    ...endVcard,
  ];

  return formatted.join(nl());
  // const formatted = vcard.split('\n').map((line, i) => {
  //   if (line.startsWith('BEGIN:VCARD')) return line;

  //   if (line.startsWith('X-SOCIALPROFILE')) {
  //     if (isIOS()) {
  //       let username = line.split(':')[1];
  //       let http = line.split(':')[1];
  //       let title = line?.split('=')[1].split(':')[0];
  //       let link = line?.split(':')[1];
  //       let domain = line.split(':')[2];
  //       let isCompany = line.includes('cmpny');

  //       const iOSSocialFormatter = (val, titleCompany, title, link) => {
  //         val = `item${i - 17}.URL;LABEL=${
  //           isCompany ? titleCompany : title
  //         }:${link} ${nl()}item${i - 17}.X-ABLabel:${
  //           isCompany ? titleCompany : title
  //         }`;

  //         return val;
  //       };

  //       if (line.includes('facebook')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'Facebook Company',
  //           'Facebook',
  //           `https://facebook.com/${username}`
  //         );
  //       } else if (line.includes('instagram')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'Instagram Company',
  //           'Instagram',
  //           `https://instagram.com/${username}`
  //         );
  //       } else if (line.includes('twitter')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'Twitter Company',
  //           'Twitter',
  //           `https://twitter.com/${username}`
  //         );
  //       } else if (line.includes('linkedin')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'LinkedIn Company',
  //           'LinkedIn',
  //           `https://linkedin.com/in/${username}`
  //         );
  //       } else if (line.includes('youtube')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'YouTube Company',
  //           'YouTube',
  //           `https://youtube.com/${username}`
  //         );
  //       } else if (line.includes('whatsapp')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'WhatsApp Company',
  //           'WhatsApp',
  //           `https://wa.me/${username.replace('+', '')}`
  //         );
  //       } else if (line.includes('github')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'GitHub Company',
  //           'GitHub',
  //           `https://github.com/${username}`
  //         );
  //       } else if (line.includes('tiktok')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'TikTok Company',
  //           'TikTok',
  //           `https://tiktok.com/${username}`
  //         );
  //       } else if (line.includes('line')) {
  //         line = iOSSocialFormatter(
  //           line,
  //           'Line Company',
  //           'Line',
  //           `https://line.me/R/ti/p/~${username}`
  //         );
  //       } else if (line.includes('email')) {
  //         line = '';
  //       } else {
  //         line = `item${i - 17}.URL;LABEL=${title}:${
  //           link.includes('http') ? http + ':' + domain : link
  //         } ${nl()}item${i - 17}.X-ABLabel:${title}`;
  //       }
  //     } else {
  //       let username = line.split(':')[1];
  //       let http = line.split(':')[1];
  //       let url = line.split(':')[2];
  //       let title = line?.split('=')[1].split(':')[0];
  //       let link = line?.split(':')[1];
  //       let isCompany = line.includes('cmpny');
  //       let domain = line.split(':')[2];

  //       const socialFormatter = (val, titleCompany, title, link) => {
  //         val = `URL;LABEL=${isCompany ? titleCompany : title}:${link}`;
  //         return val;
  //       };

  //       if (line.includes('facebook')) {
  //         line = socialFormatter(
  //           line,
  //           'Facebook Company',
  //           'Facebook',
  //           `https://facebook.com/${username}`
  //         );
  //       } else if (line.includes('instagram')) {
  //         line = socialFormatter(
  //           line,
  //           'Instagram Company',
  //           'Instagram',
  //           `https://instagram.com/${username}`
  //         );
  //       } else if (line.includes('twitter')) {
  //         line = socialFormatter(
  //           line,
  //           'Twitter Company',
  //           'Twitter',
  //           `https://twitter.com/${username}`
  //         );
  //       } else if (line.includes('linkedin')) {
  //         line = socialFormatter(
  //           line,
  //           'LinkedIn Company',
  //           'LinkedIn',
  //           `https://linkedin.com/${username}`
  //         );
  //       } else if (line.includes('youtube')) {
  //         line = socialFormatter(
  //           line,
  //           'YouTube Company',
  //           'YouTube',
  //           `https://youtube.com/${username}`
  //         );
  //       } else if (line.includes('whatsapp')) {
  //         line = socialFormatter(
  //           line,
  //           'WhatsApp Company',
  //           'WhatsApp',
  //           `https://wa.me/${username.replace('+', '')}`
  //         );
  //       } else if (line.includes('github')) {
  //         line = socialFormatter(
  //           line,
  //           'Github Company',
  //           'Github',
  //           `https://github.com/${username}`
  //         );
  //       } else if (line.includes('tiktok')) {
  //         line = socialFormatter(
  //           line,
  //           'TikTok Company',
  //           'TikTok',
  //           `https://tiktok.com/${username}`
  //         );
  //       } else if (line.includes('line')) {
  //         line = socialFormatter(
  //           line,
  //           'Line Company',
  //           'Line',
  //           `https://line.me/R/ti/p/~${username}`
  //         );
  //       } else if (line.includes('email')) {
  //         line = '';
  //       } else {
  //         line = `URL;LABEL=${title}:${
  //           link.includes('http') ? http + ':' + domain : link
  //         }`;
  //       }
  //     }

  //     return line;
  //   }
  //   if (line.startsWith('SOURCE')) return line;
  //   if (line.startsWith('REV')) return line;
  //   if (line.startsWith('END:VCARD')) {
  //     return line;
  //   }
  // });

  // return formatted.join(nl());
};

export default formatter;

// import isIOS from '@lib/utils/checkDevice';

// const nl = () => '\n';

// const formatter = (vcard) => {
//   const formatted = vcard.split('\n').map((line, i) => {
//     if (line.startsWith('BEGIN:VCARD')) return line;
//     if (line.startsWith('VERSION')) return line;
//     if (line.startsWith('FN')) return line;
//     if (line.startsWith('N')) return line;
//     if (line.startsWith('PHOTO')) return line;
//     if (line.startsWith('LOGO')) return line;
//     if (line.startsWith('LABEL')) return line;
//     if (line.startsWith('ADR')) return line;
//     if (line.startsWith('TEL')) return line;
//     if (line.startsWith('NOTE')) return line;
//     if (line.startsWith('EMAIL')) return line;
//     if (line.startsWith('TITLE')) return line;
//     if (line.startsWith('ORG')) return line;
//     if (line.startsWith('X-SOCIALPROFILE')) {
//       if (isIOS()) {
//         let username = line.split(':')[1];
//         let http = line.split(':')[1];
//         let title = line?.split('=')[1].split(':')[0];
//         let link = line?.split(':')[1];
//         let domain = line.split(':')[2];
//         let isCompany = line.includes('cmpny');

//         const iOSSocialFormatter = (val, titleCompany, title, link) => {
//           val = `item${i - 17}.URL;LABEL=${
//             isCompany ? titleCompany : title
//           }:${link} ${nl()}item${i - 17}.X-ABLabel:${
//             isCompany ? titleCompany : title
//           }`;

//           return val;
//         };

//         if (line.includes('facebook')) {
//           line = iOSSocialFormatter(
//             line,
//             'Facebook Company',
//             'Facebook',
//             `https://facebook.com/${username}`
//           );
//         } else if (line.includes('instagram')) {
//           line = iOSSocialFormatter(
//             line,
//             'Instagram Company',
//             'Instagram',
//             `https://instagram.com/${username}`
//           );
//         } else if (line.includes('twitter')) {
//           line = iOSSocialFormatter(
//             line,
//             'Twitter Company',
//             'Twitter',
//             `https://twitter.com/${username}`
//           );
//         } else if (line.includes('linkedin')) {
//           line = iOSSocialFormatter(
//             line,
//             'LinkedIn Company',
//             'LinkedIn',
//             `https://linkedin.com/in/${username}`
//           );
//         } else if (line.includes('youtube')) {
//           line = iOSSocialFormatter(
//             line,
//             'YouTube Company',
//             'YouTube',
//             `https://youtube.com/${username}`
//           );
//         } else if (line.includes('whatsapp')) {
//           line = iOSSocialFormatter(
//             line,
//             'WhatsApp Company',
//             'WhatsApp',
//             `https://wa.me/${username.replace('+', '')}`
//           );
//         } else if (line.includes('github')) {
//           line = iOSSocialFormatter(
//             line,
//             'GitHub Company',
//             'GitHub',
//             `https://github.com/${username}`
//           );
//         } else if (line.includes('tiktok')) {
//           line = iOSSocialFormatter(
//             line,
//             'TikTok Company',
//             'TikTok',
//             `https://tiktok.com/${username}`
//           );
//         } else if (line.includes('line')) {
//           line = iOSSocialFormatter(
//             line,
//             'Line Company',
//             'Line',
//             `https://line.me/R/ti/p/~${username}`
//           );
//         } else if (line.includes('email')) {
//           line = '';
//         } else {
//           line = `item${i - 17}.URL;LABEL=${title}:${
//             link.includes('http') ? http + ':' + domain : link
//           } ${nl()}item${i - 17}.X-ABLabel:${title}`;
//         }
//       } else {
//         let username = line.split(':')[1];
//         let http = line.split(':')[1];
//         let url = line.split(':')[2];
//         let title = line?.split('=')[1].split(':')[0];
//         let link = line?.split(':')[1];
//         let isCompany = line.includes('cmpny');
//         let domain = line.split(':')[2];

//         const socialFormatter = (val, titleCompany, title, link) => {
//           val = `URL;LABEL=${isCompany ? titleCompany : title}:${link}`;
//           return val;
//         };

//         if (line.includes('facebook')) {
//           line = socialFormatter(
//             line,
//             'Facebook Company',
//             'Facebook',
//             `https://facebook.com/${username}`
//           );
//         } else if (line.includes('instagram')) {
//           line = socialFormatter(
//             line,
//             'Instagram Company',
//             'Instagram',
//             `https://instagram.com/${username}`
//           );
//         } else if (line.includes('twitter')) {
//           line = socialFormatter(
//             line,
//             'Twitter Company',
//             'Twitter',
//             `https://twitter.com/${username}`
//           );
//         } else if (line.includes('linkedin')) {
//           line = socialFormatter(
//             line,
//             'LinkedIn Company',
//             'LinkedIn',
//             `https://linkedin.com/${username}`
//           );
//         } else if (line.includes('youtube')) {
//           line = socialFormatter(
//             line,
//             'YouTube Company',
//             'YouTube',
//             `https://youtube.com/${username}`
//           );
//         } else if (line.includes('whatsapp')) {
//           line = socialFormatter(
//             line,
//             'WhatsApp Company',
//             'WhatsApp',
//             `https://wa.me/${username.replace('+', '')}`
//           );
//         } else if (line.includes('github')) {
//           line = socialFormatter(
//             line,
//             'Github Company',
//             'Github',
//             `https://github.com/${username}`
//           );
//         } else if (line.includes('tiktok')) {
//           line = socialFormatter(
//             line,
//             'TikTok Company',
//             'TikTok',
//             `https://tiktok.com/${username}`
//           );
//         } else if (line.includes('line')) {
//           line = socialFormatter(
//             line,
//             'Line Company',
//             'Line',
//             `https://line.me/R/ti/p/~${username}`
//           );
//         } else if (line.includes('email')) {
//           line = '';
//         } else {
//           line = `URL;LABEL=${title}:${
//             link.includes('http') ? http + ':' + domain : link
//           }`;
//         }
//       }

//       return line;
//     }
//     if (line.startsWith('SOURCE')) return line;
//     if (line.startsWith('REV')) return line;
//     if (line.startsWith('END:VCARD')) {
//       return line;
//     }
//   });

//   return formatted.join(nl());
// };

// export default formatter;
