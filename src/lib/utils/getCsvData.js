import getSocialMediaCsv from '@lib/utils/getSocialMediaCsv';

export const getConnectionsCsv = (data) => {
  let connectionsCsv = null;
  connectionsCsv = data.map((item) => {
    return {
      Date: item.dateConnected,
      Firstname: item.firstname,
      Lastname: item.lastname,
      Company: item.company,
      Job: item.job,
      Twitter: getSocialMediaCsv(item.socials, 'twitter'),
      Linkedin: getSocialMediaCsv(item.socials, 'linkedin'),
      Whatsapp: getSocialMediaCsv(item.socials, 'whatsapp'),
      Email: getSocialMediaCsv(item.socials, 'email'),
      Phone: getSocialMediaCsv(item.socials, 'phone'),
      Line: getSocialMediaCsv(item.socials, 'line'),
      Tiktok: getSocialMediaCsv(item.socials, 'tiktok'),
      Instagram: getSocialMediaCsv(item.socials, 'instagram'),
      Facebook: getSocialMediaCsv(item.socials, 'facebook'),
      Youtube: getSocialMediaCsv(item.socials, 'youtube'),
      Links: item.links.map((link) => {
        return link.link;
      }),
      Message: item.message,
      Attached_link: item.link,
      By: item.by.firstname + ' ' + item.by.lastname,
    };
  });

  return connectionsCsv;
};

export const getLogsCsv = (data) => {
  let logsCsv = null;
  logsCsv = data.map((log) => {
    return {
      Date: log.created_at,
      Card: log.card,
      Message: log.message,
      Type: log.type,
      Team: log.team,
      TeamMember:
        log.team_member.team_profile.firstname +
        ' ' +
        log.team_member.team_profile.lastname,
    };
  });

  return logsCsv;
};
