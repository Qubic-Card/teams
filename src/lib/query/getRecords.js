import convertToGMT7 from '@lib/utils/convertToGMT7';
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

const removeByName = (arr) => {
  let idxBy = arr.findIndex((item) => item === 'by');
  let newArr = arr.slice(0, idxBy);

  return newArr;
};

export const getConnectionsRecords = async (col, id, fromDate, toDate) => {
  fromDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0)).toUTCString();
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

  if (error) {
    console.log(error);
  } else {
    if (data.length === 0) {
      toastFailed('No data found for this period');
    } else {
      let items = data.map((item) => {
        return {
          DateConnected: convertToGMT7(item?.dateConnected),
          Firstname: item?.firstname,
          Lastname: item?.lastname,
          Company: item?.company,
          Job: item?.job,
          // Links: item?.links,
          Email: getSocialMediaCsv(item?.socials, 'email'),
          Phone: getSocialMediaCsv(item?.socials, 'phone'),
          Twitter: getSocialMediaCsv(item?.socials, 'twitter'),
          LinkedIn: getSocialMediaCsv(item?.socials, 'linkedin'),
          WhatsApp: getSocialMediaCsv(item?.socials, 'whatsapp'),
          Line: getSocialMediaCsv(item?.socials, 'line'),
          TikTok: getSocialMediaCsv(item?.socials, 'tiktok'),
          Instagram: getSocialMediaCsv(item?.socials, 'instagram'),
          Facebook: getSocialMediaCsv(item?.socials, 'facebook'),
          YouTube: getSocialMediaCsv(item?.socials, 'youtube'),
          Links1: item?.links[0]?.link,
          Links2: item?.links[1]?.link,
          Links3: item?.links[2]?.link,
          Links4: item?.links[3]?.link,
          Links5: item?.links[4]?.link,
          Message: item?.message,
          Link: item?.link,
          By: item?.by.firstname + ' ' + item.by.lastname,
        };
      });
      const csv = convertToCSV(items);

      return csv;
    }
  }
};

export const getLogsRecords = async (col, id, fromDate, toDate) => {
  fromDate = new Date(new Date(fromDate).setHours(0, 0, 0, 0)).toUTCString();

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
      if (data.length === 0) {
        toastFailed('No data found for this period');
      } else {
        let logs = data.map((log) => {
          return {
            Created_at: convertToGMT7(log?.created_at),
            Team: log?.team?.name,
            Company: log?.team?.company,
            Message: log?.data?.message?.includes('removed')
              ? log?.data?.message.split(' ')[0] +
                ' ' +
                'has been removed from team'
              : log?.data?.message?.includes('activated') ||
                log?.type === 'WARN'
              ? removeByName(log?.data?.message.split(' ')).join(' ')
              : log?.data?.message.slice(5).charAt(0).toUpperCase() +
                log?.data?.message.slice(6),
            Holder: log.card_holder ?? '-',
            position: `latitude: ${
              log?.data?.position?.lat ?? '-'
            }, longitude: ${log?.data?.position?.long ?? '-'}`,
          };
        });

        const csv = convertToCSV(logs);

        return csv;
      }
    }
  }
};
