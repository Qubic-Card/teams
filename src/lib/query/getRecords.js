import convertToGMT7 from '@lib/utils/convertToGMT7';
import getSocialMediaCsv from '@lib/utils/getSocialMediaCsv';
import { socialIcons } from '@lib/constants';
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

const socials = Object.keys(socialIcons);

const msgFormatter = (arr, first, sec) => {
  let res;

  if (sec) {
    let index = arr.findIndex((item) => item === first);
    let index2 = arr.findIndex((item) => item === sec);

    res = arr
      .slice(index, index + 1)
      .concat(arr.slice(index2))
      .join(' ');

    res = res.charAt(0).toUpperCase() + res.slice(1);
  } else if (first) {
    let index = arr.findIndex((item) => item === first);

    res = arr.slice(0, index).join(' ');
  } else {
    if (arr.includes('joined')) {
      res = arr.slice(1).join(' ');
    } else {
      arr.pop();

      if (arr.includes('link')) {
        res = arr[2];
      } else if (arr.includes('contact')) {
        res = 'Add to ' + arr[1].charAt(0).toUpperCase() + arr[1].slice(1);
      } else if (arr.includes('brochure')) {
        res = arr[1].charAt(0).toUpperCase() + arr[1].slice(1);
      } else {
        res = arr.join(' ');
      }

      if (socials.some((v) => arr.join(' ').includes(v))) {
        if (arr.includes('company')) {
          res = arr
            .slice(1, arr.indexOf('was'))
            .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
            .join(' ');
        } else {
          res = arr[1].charAt(0).toUpperCase() + arr[1].slice(1);
        }
      }
    }
  }

  return res;
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
    .lt('dateConnected', toDate)
    .order('dateConnected', { ascending: false });

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
    .lt('created_at', toDate)
    .order('created_at', { ascending: false });

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
            'Created at': convertToGMT7(log?.created_at),
            Team: log?.team?.name,
            Company: log?.team?.company,
            Interactions: log?.data?.message?.includes('removed')
              ? log?.data?.message.split(' ')[0] + ' ' + 'has been removed'
              : log?.data?.message?.includes('activated') ||
                log?.type === 'WARN'
              ? msgFormatter(log?.data?.message.split(' '), 'by')
              : log?.data?.message?.includes('QRScan')
              ? msgFormatter(log?.data?.message.split(' '), 'profile', 'QRScan')
              : log?.data?.message?.includes('NFCtap')
              ? msgFormatter(log?.data?.message.split(' '), 'profile', 'NFC')
              : msgFormatter(log?.data?.message.split(' ')),
            'Card Holder': log?.card_holder ?? '',
            'Card ID': log?.data?.card?.slice(-6) ?? '',
            Platform: log?.platform ?? '',
            Latitude: log?.data?.position?.lat ?? '',
            Longitude: log?.data?.position?.long ?? '' ?? '',
          };
        });

        const csv = convertToCSV(logs);

        return csv;
      }
    }
  }
};
