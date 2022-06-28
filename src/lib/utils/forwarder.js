import { log } from '@lib/logger/logger';
import { goto } from '$app/navigation';

export const go = async (type, data, pageState, cardId, profileUid) => {
  switch (type) {
    case 'line':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          `https://line.me/R/ti/p/~${data}`,
          cardId,
          profileUid
        );
      }
      await goto(`https://line.me/R/ti/p/~${data}`);
      break;
    case 'whatsapp':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://wa.me/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://wa.me/' + data.split('+'));
      break;
    case 'instagram':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://instagram.com/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://instagram.com/' + data);
      break;
    case 'facebook':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://facebook.com/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://facebook.com/' + data);
      break;
    case 'twitter':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://twitter.com/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://twitter.com/' + data);
      break;
    case 'tiktok':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://tiktok.com/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://tiktok.com/' + data);
      break;
    case 'linkedin':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://linkedin.com/in/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://linkedin.com/' + data);
      break;
    case 'youtube':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'https://youtube.com/' + data,
          cardId,
          profileUid
        );
      }
      await goto('https://youtube.com/' + data);
      break;
    case 'email':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'mailto:' + data,
          cardId,
          profileUid
        );
      }
      window.location.href = 'mailto:' + data;
      break;
    case 'phone':
      if (pageState != 'Preview') {
        await log(
          `Your ${type} was opened`,
          'INFO',
          'tel:' + data,
          cardId,
          profileUid
        );
      }
      window.location.href = 'tel:' + data;
      break;
    default:
      break;
  }
};
