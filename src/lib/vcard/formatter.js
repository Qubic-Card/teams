import isIOS from '@lib/utils/checkDevice';

const nl = () => '\n';

const formatter = (vcard) => {
  const formatted = vcard.split('\n').map((line, i) => {
    if (line.startsWith('BEGIN:VCARD')) return line;
    if (line.startsWith('VERSION')) return line;
    if (line.startsWith('FN')) return line;
    if (line.startsWith('N')) return line;
    if (line.startsWith('PHOTO')) return line;
    if (line.startsWith('LOGO')) return line;
    if (line.startsWith('LABEL')) return line;
    if (line.startsWith('ADR')) return line;
    if (line.startsWith('TEL')) return line;
    if (line.startsWith('NOTE')) return line;
    if (line.startsWith('EMAIL')) return line;
    if (line.startsWith('TITLE')) return line;
    if (line.startsWith('ORG')) return line;
    if (line.startsWith('X-SOCIALPROFILE')) {
      if (isIOS()) {
        let username = line.split(':')[1];
        let http = line.split(':')[1];
        let title = line?.split('=')[1].split(':')[0];
        let link = line?.split(':')[1];
        let domain = line.split(':')[2];
        let isCompany = line.includes('company');

        if (line.includes('facebook')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'Facebook Company' : 'Facebook'
          }:https://facebook.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'Facebook Company' : 'Facebook'
          }`;
        } else if (line.includes('instagram')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'Instagram Company' : 'Instagram'
          }:https://instagram.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'Instagram Company' : 'Instagram'
          }`;
        } else if (line.includes('twitter')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'Twitter Company' : 'Twitter'
          }:https://twitter.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'Twitter Company' : 'Twitter'
          }`;
        } else if (line.includes('linkedin')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'LinkedIn Company' : 'LinkedIn'
          }:https://linkedin.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'LinkedIn Company' : 'LinkedIn'
          }`;
        } else if (line.includes('youtube')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'YouTube Company' : 'YouTube'
          }:https://youtube.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'YouTube Company' : 'YouTube'
          }`;
        } else if (line.includes('whatsapp')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'WhatsApp Company' : 'WhatsApp'
          }:https://wa.me/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'WhatsApp Company' : 'WhatsApp'
          }`;
        } else if (line.includes('tiktok')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'TikTok Company' : 'TikTok'
          }:https://tiktok.com/${username} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'TikTok Company' : 'TikTok'
          }`;
        } else if (line.includes('line')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'Line Company' : 'Line'
          }:https://line.me/R/ti/p/~${username} ${nl()}item${
            i - 17
          }.X-ABLabel:${isCompany ? 'Line Company' : 'Line'}`;
        } else if (line.includes('email')) {
          line = '';
        } else {
          line = `item${i - 17}.URL;LABEL=${title}:${
            link.includes('http') ? http + ':' + domain : link
          } ${nl()}item${i - 17}.X-ABLabel:${title}`;
        }
      } else {
        let username = line.split(':')[1];
        let http = line.split(':')[1];
        let url = line.split(':')[2];
        let title = line?.split('=')[1].split(':')[0];
        let link = line?.split(':')[1];
        let isCompany = line.includes('company');
        let domain = line.split(':')[2];

        if (line.includes('facebook')) {
          line = `URL;LABEL=${
            isCompany ? 'Facebook Company' : 'Facebook'
          }:https://facebook.com/${username}`;
        } else if (line.includes('instagram')) {
          line = `URL;LABEL=${
            isCompany ? 'Instagram Company' : 'Instagram'
          }:https://instagram.com/${username}`;
        } else if (line.includes('twitter')) {
          line = `URL;LABEL=${
            isCompany ? 'Twitter Company' : 'Twitter'
          }:https://twitter.com/${username}`;
        } else if (line.includes('linkedin')) {
          line = `URL;LABEL=${
            isCompany ? 'LinkedIn Company' : 'LinkedIn'
          }:https://linkedin.com/${username}`;
        } else if (line.includes('youtube')) {
          line = `URL;LABEL=${
            isCompany ? 'YouTube Company' : 'YouTube'
          }:https://youtube.com/${username}`;
        } else if (line.includes('whatsapp')) {
          line = `URL;LABEL=${
            isCompany ? 'WhatsApp Company' : 'WhatsApp'
          }:https://wa.me/${username}`;
        } else if (line.includes('tiktok')) {
          line = `URL;LABEL=${
            isCompany ? 'TikTok Company' : 'TikTok'
          }:https://tiktok.com/${username}`;
        } else if (line.includes('line')) {
          line = `URL;LABEL=${
            isCompany ? 'Line Company' : 'Line'
          }:https://line.me/R/ti/p/~${username}`;
        } else if (line.includes('email')) {
          line = '';
        } else {
          line = `URL;LABEL=${title}:${
            link.includes('http') ? http + ':' + domain : link
          }`;
        }
      }

      return line;
    }
    if (line.startsWith('SOURCE')) return line;
    if (line.startsWith('REV')) return line;
    if (line.startsWith('END:VCARD')) {
      return line;
    }
  });

  return formatted.join(nl());
};

export default formatter;
