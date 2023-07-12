import { goto } from '$app/navigation';

const go = async (type, data) => {
  switch (type) {
    case 'threads':
      await goto(`https://threads.net/${data}`);
    case 'discord':
      await goto(`https://discord.gg/${data}`);
    case 'telegram':
      await goto(`https://t.me/${data}`);
      break;
    case 'github':
      await goto('https://github.com/' + data);
      break;
    case 'whatsapp':
      await goto('https://wa.me/' + data);
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
    case 'instagram':
      await goto('https://instagram.com/' + data);
      break;
    case 'line':
      await goto('https://line.me/R/ti/p/~' + data);
      break;
    case 'email':
      await goto('mailto:' + data);
      break;
    case 'phone':
      await goto('tel:' + data);
      break;
    default:
      break;
  }
};

export default go;
