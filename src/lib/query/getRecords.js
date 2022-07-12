import getSocialMediaCsv from '@lib/utils/getSocialMediaCsv';
import supabase from '@lib/db';

const convertToCSV = (arr) => {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join('\n');
};

export const getConnectionsRecords = async (col, id, fromDate, toDate) => {
  const { data, error } = await supabase
    .from('team_connection_acc')
    // .select('*')
    .select(
      'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)'
    )
    .eq(col, id)
    .lte('dateConnected', new Date(fromDate).toUTCString())
    .gte('dateConnected', new Date(toDate).toUTCString());
  // .csv();

  if (error) {
    console.log(error);
  } else {
    console.log(data);
    let items = data.map((item) => {
      return {
        DateConnected: item?.dateConnected,
        Firstname: item?.firstname,
        Lastname: item?.lastname,
        Company: item?.company,
        Job: item?.job,
        Avatar: item?.avatar,
        // Links: item?.links,
        Links1: item?.links[0]?.link,
        Links2: item?.links[1]?.link,
        Links3: item?.links[2]?.link,
        Links4: item?.links[3]?.link,
        Links5: item?.links[4]?.link,
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
        Message: item?.message,
        Link: item?.link,
        By: item?.by.firstname + ' ' + item.by.lastname,
      };
    });
    const csv = convertToCSV(items);

    // console.log(csv);
    return csv;
  }
};

export const getLogsRecords = async (col, id, fromDate, toDate) => {
  const { data, error } = await supabase
    .from('team_logs')
    .select(
      '*, team_member(team_profile->firstname, team_profile->lastname), team(metadata->company, name)'
    )
    .eq(col, id)
    .lte('created_at', new Date(fromDate).toUTCString())
    .gte('created_at', new Date(toDate).toUTCString());
  // .csv();

  if (error) {
    console.log(error);
  } else {
    let logs = data.map((log) => {
      return {
        Created_at: log.created_at,
        Id: log.id,
        Type: log.type,
        Team: log?.team?.name,
        Company: log.team.company,
        Message: log.data.message,
        Link: log.data.link,
        TeamMember: log.team_member.firstname + ' ' + log.team_member.lastname,
      };
    });

    const csv = convertToCSV(logs);
    return csv;
  }
};
