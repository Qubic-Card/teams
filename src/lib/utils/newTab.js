const toNewTab = async (type, data) => {
  switch (type) {
    case 'discord':
      return window.open(`https://discord.gg/${data}`, '_blank');
      break;
    case 'telegram':
      return window.open(`https://t.me/${data}`, '_blank').focus();
      break;
    case 'github':
      await window.open('https://github.com/' + data, '_blank').focus();
      break;
      case 'maps':
      await window.open('https://maps.app.goo.gl/'+ data, '_blank').focus();
      break;
    case 'threads':
      await window.open('https://threads.net/' + data, '_blank').focus();
      break;
    case 'whatsapp':
      await window.open('https://wa.me/' + data, '_blank').focus();
      break;
    case 'facebook':
      await window.open('https://facebook.com/' + data, '_blank').focus();
      break;
    case 'twitter':
      await window.open('https://twitter.com/' + data, '_blank').focus();
      break;
    case 'tiktok':
      await window.open('https://tiktok.com/' + data, '_blank').focus();
      break;
    case 'linkedin':
      await window.open('https://linkedin.com/' + data, '_blank').focus();
      break;
    case 'youtube':
      await window.open('https://youtube.com/' + data, '_blank').focus();
      break;
    case 'instagram':
      await window.open('https://instagram.com/' + data, '_blank').focus();
      break;
    case 'line':
      await window.open('https://line.me/R/ti/p/~' + data, '_blank').focus();
      break;
    case 'email':
      await window.open('mailto:' + data, '_blank').focus();
      break;
    case 'phone':
      await window.open('tel:' + data, '_blank').focus();
      break;
    default:
      break;
  }
};

export default toNewTab;
