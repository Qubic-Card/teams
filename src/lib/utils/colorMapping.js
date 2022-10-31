const colorMapping = (social) => {
  let color = '';

  switch (social) {
    case 'instagram':
      color = 'bg-red-500';
      break;
    case 'twitter':
      color = 'bg-blue-500';
      break;
    case 'facebook':
      color = 'bg-emerald-500';
      break;
    case 'youtube':
      color = 'bg-orange-500';
      break;
    case 'linkedin':
      color = 'bg-cyan-500';
      break;
    case 'whatsapp':
      color = 'bg-green-500';
      break;
    case 'tiktok':
      color = 'bg-amber-500';
      break;
    case 'email':
      color = 'bg-fuchsia-500';
      break;
    case 'phone':
      color = 'bg-purple-500';
      break;
    case 'line':
      color = 'bg-lime-500';
      break;
    case 'github':
      color = 'bg-stone-500';
      break;
    case 'telegram':
      color = 'bg-sky-500';
      break;
    case 'discord':
      color = 'bg-indigo-500';
      break;

    default:
      color = 'bg-white';
      break;
  }

  return color;
};

export default colorMapping;
