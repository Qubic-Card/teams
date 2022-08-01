import getSocialMediaCsv from '@lib/utils/getSocialMediaCsv';
import supabase from '@lib/db';
import { toastFailed } from '@lib/utils/toast';

const convertToCSV = (arr) => {
  const array = [Object.keys(arr[0])].concat(arr);

  return array
    .map((it) => {
      return Object.values(it).toString();
    })
    .join('\n');
};

export const getConnectionsRecords = async (col, id, fromDate, toDate) => {
  fromDate = new Date(
    new Date(fromDate)
  ).toUTCString();
  toDate = new Date(
    new Date(toDate).setDate(new Date(toDate).getDate() + 1)
  ).toUTCString();
  

  const { data, error } = await supabase
    .from('team_connection_acc')
    // .select('*')
    .select(
      'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)'
    )
    .eq(col, id)
    .gte('dateConnected', fromDate)
    .lt('dateConnected', toDate);
  // .csv();

  if (error) {
    console.log(error);
  } else {
    console.log(data);
    if (data.length === 0) {
      toastFailed('No data found for this period');
    } else {
      let items = data.map((item) => {
        return {
          DateConnected: new Date(new Date(item?.dateConnected).setUTCHours(7)),
          Firstname: item?.firstname,
          Lastname: item?.lastname,
          Company: item?.company,
          Job: item?.job,
          // Links: item?.links,
          Links1: item?.links[0]?.link,
          Links2: item?.links[1]?.link,
          Links3: item?.links[2]?.link,
          Links4: item?.links[3]?.link,
          Links5: item?.links[4]?.link,
          Twitter: getSocialMediaCsv(item?.socials, 'twitter'),
          LinkedIn: getSocialMediaCsv(item?.socials, 'linkedin'),
          WhatsApp: getSocialMediaCsv(item?.socials, 'whatsapp'),
          Email: getSocialMediaCsv(item?.socials, 'email'),
          Phone: getSocialMediaCsv(item?.socials, 'phone'),
          Line: getSocialMediaCsv(item?.socials, 'line'),
          TikTok: getSocialMediaCsv(item?.socials, 'tiktok'),
          Instagram: getSocialMediaCsv(item?.socials, 'instagram'),
          Facebook: getSocialMediaCsv(item?.socials, 'facebook'),
          YouTube: getSocialMediaCsv(item?.socials, 'youtube'),
          Message: item?.message,
          Link: item?.link,
          By: item?.by.firstname + ' ' + item.by.lastname,
        };
      });
      const csv = convertToCSV(items);

      // console.log(csv);
      return csv;
    }
  }
};

export const getLogsRecords = async (col, id, fromDate, toDate) => {
  
  fromDate = new Date(
    new Date(fromDate)
  ).toUTCString();
  toDate = new Date(
    new Date(toDate).setDate(new Date(toDate).getDate() + 1)
  ).toUTCString();

  
  const { data, error } = await supabase
    .from('team_logs')
    .select(
      '*, team_member(team_profile->firstname, team_profile->lastname), team(metadata->company, name)'
    )
    .eq(col, id)
    .gte('created_at', fromDate)
    .lt('created_at', toDate);
  // .csv();

  if (error) {
    console.log(error);
    return [];
  } else {
    if (data) {
      console.log("data", data)
      if (data.length === 0) {
        toastFailed('No data found for this period');
      } else {
        let logs = data.map((log) => {
          return {
            Created_at: new Date(
              new Date(toDate).setHours(new Date(log?.created_at).getHours() + 7)
            ).toUTCString(),
            Type: log?.type,
            Team: log?.team?.name,
            Company: log?.team?.company,
            Message: log?.data?.message,
            Link: log?.data?.link,
            TeamMember:
              log?.team_member?.firstname + ' ' + log.team_member?.lastname,
            Holder: log.card_holder ?? '-',
          };
        });
        console.log("logsAfterConverted", logs)
        const csv = convertToCSV(logs);
        return csv;
      }
    }

  }
};
