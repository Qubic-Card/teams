const nl = () => '\n';

const formatter = (vcard, isIOS, socials, links) => {
  const formatted = vcard.split('\n').map((line, i) => {
    if (line.startsWith('BEGIN:VCARD')) {
      return line;
    }
    if (line.startsWith('VERSION')) {
      return line;
    }
    if (line.startsWith('FN')) {
      return line;
    }
    if (line.startsWith('N')) {
      return line;
    }
    if (line.startsWith('PHOTO')) {
      return 'PHOTO;ENCODING=b;TYPE=JPEG:' + line.slice(6).split(',')[1];
    }
    if (line.startsWith('TEL')) {
      return line;
    }
    if (line.startsWith('EMAIL')) {
      return line;
    }
    if (line.startsWith('TITLE')) {
      return line;
    }
    if (line.startsWith('ORG')) {
      return line;
    }
    if (line.startsWith('URL')) {
      if (isIOS) {
        socials.map((social) => {
          if (line.includes('instagram.com') && social.type === 'instagram') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://instagram.com/${social.data}`
              )} ${nl()}item${i - 8}.X-ABLabel:Instagram`
            );
          }
          if (line.includes('facebook.com') && social.type === 'facebook') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `X-SOCIALPROFILE;type=${social.type}:https://facebook.com/${social.data}`
            );
          }
          if (line.includes('twitter.com') && social.type === 'twitter') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `X-SOCIALPROFILE;type=${social.type}:https://twitter.com/${social.data}`
            );
          }
          if (line.includes('linkedin.com') && social.type === 'linkedin') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://linkedin.com/in/${social.data}`
              )} ${nl()}item${i - 8}.X-ABLabel:LinkedIn`
            );
          }
          if (line.includes('youtube.com') && social.type === 'youtube') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://youtube.com/${social.data}`
              )} ${nl()}item${i - 8}.X-ABLabel:YouTube`
            );
          }
          if (line.includes('Whatsapp') && social.type === 'whatsapp') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://wa.me/${social.data}`
              )}${nl()}item${i - 8}.X-ABLabel:WhatsApp`
            );
          }
          if (line.includes('tiktok') && social.type === 'tiktok') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://tiktok.com/${social.data}`
              )} ${nl()}item${i - 8}.X-ABLabel:TikTok`
            );
          }
          if (line.includes('line') && social.type === 'line') {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:https://line.me/R/ti/p/~${social.data}`
              )} ${nl()}item${i - 8}.X-ABLabel:Line`
            );
          }
        });
        if (line.startsWith('URL')) {
          links.map((link) => {
            let label = line.split(4, 9);
            line = line.replace(
              line,
              `item${i - 8}.${line.replace(
                label,
                `URL:${link.link}`
              )} ${nl()}item${i - 8}.X-ABLabel:Website`
            );
          });
        }
      }

      return line;
    }
    if (line.startsWith('END:VCARD')) {
      return line;
    }
  });

  return formatted.join(nl());
};

export default formatter;
