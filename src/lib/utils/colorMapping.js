const colorMapping = (social) => {
  let color = '';

  switch (social) {
    case 'instagram':
      color = 'bg-red-600';
      break;
    case 'twitter':
      color = 'bg-blue-800';
      break;
    case 'facebook':
      color = 'bg-emerald-700';
      break;
    case 'youtube':
      color = 'bg-orange-600';
      break;
    case 'linkedin':
      color = 'bg-cyan-500';
      break;
    case 'whatsapp':
      color = 'bg-green-900';
      break;
    case 'tiktok':
      color = 'bg-neutral-700';
      break;
    case 'email':
      color = 'bg-fuchsia-600';
      break;
    case 'phone':
      color = 'bg-blue-500';
      break;
    case 'line':
      color = 'bg-lime-600';
      break;
    case 'github':
      color = 'bg-stone-800';
      break;
    case 'telegram':
      color = 'bg-cyan-700';
      break;
    case 'discord':
      color = 'bg-indigo-900';
      break;

    default:
      color = 'bg-black';
      break;
  }

  return color;
};

export default colorMapping;
