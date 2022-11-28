const getSocialMediaCsv = (data, type) => {
  let social = null;
  social = data
    .map((social) => social)
    .filter((social) => social.type === type);

  switch (type) {
    case 'twitter':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://twitter.com/' + social[0]?.data;
      }
    case 'facebook':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://facebook.com/' + social[0]?.data;
      }
    case 'instagram':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://instagram.com/' + social[0]?.data;
      }
    case 'linkedin':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://linkedin.com/' + social[0]?.data;
      }
    case 'youtube':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://youtube.com/' + social[0]?.data;
      }
    case 'whatsapp':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://wa.me/' + social[0]?.data;
      }
    case 'line':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://line.me/R/ti/p/~' + social[0]?.data;
      }
    case 'tiktok':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return 'https://tiktok.com/' + social[0]?.data;
      }
    case 'email':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        return social[0]?.data;
      }
    case 'phone':
      if (social[0]?.data === '' || social[0]?.data === undefined) {
        return;
      } else {
        if (social[0]?.data.charAt(0) === '0') {
          return '+62' + social[0]?.data.slice(1);
        } else {
          return social[0]?.data;
        }
      }
    default:
      break;
  }
};

export default getSocialMediaCsv;
