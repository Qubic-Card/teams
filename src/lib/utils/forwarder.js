import { goto } from '$app/navigation';

export const go = async (type, data, pageState, cardId, profileUid) => {
  switch (type) {
    case 'threads':
      await goto(`https://threads.net/@${data}`);
      break;
    case 'line':
      await goto(`https://line.me/R/ti/p/~${data}`);
      break;
    case 'whatsapp':
      await goto('https://wa.me/' + data.split('+'));
      break;
    case 'instagram':
      await goto('https://instagram.com/' + data);
      break;
    case 'facebook':
      await goto('https://facebook.com/' + data);
      break;
    case 'twitter':
      await goto('https://twitter.com/' + data);
      break;
    case 'tiktok':
      await goto('https://tiktok.com/' + data);
      break;
    case 'linkedin':
      await goto('https://linkedin.com/' + data);
      break;
    case 'youtube':
      await goto('https://youtube.com/' + data);
      break;
    case 'email':
      window.location.href = 'mailto:' + data;
      break;
    case 'phone':
      window.location.href = 'tel:' + data;
      break;
    default:
      break;
  }
};
