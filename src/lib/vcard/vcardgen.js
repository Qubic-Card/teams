import { default as vCardJS } from 'tappin-vcards-js';

const nl = () => '\n';

const iOS = () => {
  return (
    [
      'iPad Simulator',
      'iPhone Simulator',
      'iPod Simulator',
      'iPad',
      'iPhone',
      'iPod',
    ].includes(navigator.platform) ||
    // iPad on iOS 13 detection
    (navigator.userAgent.includes('Mac') && 'ontouchend' in document)
  );
};

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
      if (iOS()) {
        let username = line.split(':')[1];
        let http = line.split(':')[1];
        let url = line.split(':')[2];
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
        } else if (!line.includes('email')) {
          line = `item${i - 17}.URL;LABEL=${
            isCompany ? 'URL Company' : 'URL'
          }:${http + ':' + url} ${nl()}item${i - 17}.X-ABLabel:${
            isCompany ? 'Website Company' : 'Website'
          }`;
        } else {
          line = '';
        }
      } else {
        let username = line.split(':')[1];
        let http = line.split(':')[1];
        let url = line.split(':')[2];
        let isCompany = line.includes('company');

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
        } else if (!line.includes('email')) {
          line = `URL;LABEL=${isCompany ? 'URL Company' : 'URL'}:${
            http + ':' + url
          }`;
        } else {
          line = '';
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

export const genvcard = async (prop, team) => {
  let phoneNumber;
  let personalEmail;
  prop.socials.map((social) => {
    if (social.type === 'email') personalEmail = social.data;
    if (social.type === 'phone') {
      phoneNumber = social.data;
      if (phoneNumber.startsWith('+')) phoneNumber = phoneNumber.slice(1);
      if (phoneNumber.startsWith('0')) {
        phoneNumber = phoneNumber.slice(1);
        phoneNumber = '62' + phoneNumber;
      }
    }
  });

  let vCard = new vCardJS();
  //set basic properties shown before
  vCard.firstName = prop.firstname;
  vCard.lastName = prop.lastname ?? '';

  if (prop.company) vCard.organization = prop.company;

  if (prop.avatar)
    vCard.photo.embedFromString(
      await getBase64FromUrl(prop.avatar),
      'image/png'
    );

  if (prop.job) vCard.title = prop.job;

  vCard.note =
    'Added via Qubic card on ' +
    new Date(new Date().setUTCHours(7)).toDateString().slice(4);

  //set URL where the vCard can be found
  vCard.source = 'https://qubic.id';
  //set email addresses

  if (team) {
    if (team.logo)
      vCard.logo.embedFromString(
        await getBase64FromUrl(team.logo),
        'image/png'
      );

    // if (team.contactNumber) vCard.workPhone = team.contactNumber;

    // if (team.email) vCard.workEmail = team.email;

    //set address information

    if (team.address) {
      vCard.workAddress.label = 'Work Address';
      vCard.workAddress.street = team.address;
      vCard.workAddress.city = team.address.city;
      vCard.workAddress.stateProvince = team.address.state;
      vCard.workAddress.postalCode = team.address.postal;
      vCard.workAddress.countryRegion = team.address.country;
    }

    if (team.socials) {
      team.socials.map((e) => {
        if (e.type == 'phone') return (vCard.workPhone = e.data);
        if (e.type == 'email') return (vCard.email = [e.data, personalEmail]);
        if (e.type === 'whatsapp') {
          if (e.data !== phoneNumber) {
            vCard.workPhone = [e.data, phoneNumber];
          }
        }

        return (vCard.socialUrls[e.type + 'company'] = e.data);
      });
    }

    if (team.links) {
      team.links.map((e) => {
        if (e.isActive) return (vCard.socialUrls[e.title + 'company'] = e.link);
      });
    }
  }

  //set social media URLs
  if (prop.socials) {
    prop.socials.map((e) => {
      if (e.isActive) {
        if (e.type == 'phone') return (vCard.cellPhone = e.data);
        if (team) {
          return;
        } else {
          if (e.type == 'email') return (vCard.email = e.data);
        }
        if (e.type === 'whatsapp') {
          if (e.data !== phoneNumber) vCard.cellPhone = [e.data, phoneNumber];
        }

        return (vCard.socialUrls[e.type] = e.data);
      }
    });
  }

  if (prop.links) {
    prop.links.map((e) => {
      if (e.isActive) return (vCard.socialUrls[e.title] = e.link);
    });
  }

  vCard.version = '3.0'; //can also support 2.1 and 4.0, certain versions only support certain fields

  // try to sorting social media
  let newObj = Object.entries(vCard.socialUrls).reduce(
    (p, [k, v]) => ({ ...p, [k]: vCard.socialUrls[k] }),
    {}
  );
  // console.log(newObj);
  vCard.socialUrls = newObj;
  // console.log(vCard);

  const formatted = formatter(vCard.getFormattedString());

  return formatted;
};

const getBase64FromUrl = async (url) => {
  const data = await fetch(url);
  const blob = await data.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result.slice(23);
      resolve(base64data);
    };
  });
};
