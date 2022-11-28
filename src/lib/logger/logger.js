import UAParser from 'ua-parser-js';
import { genId } from '@lib/utils/identity';
import supabase from '@lib/db';

export const log = async (
  message,
  type,
  cardId,
  teamId,
  holder,
  link,
  memberid
) => {
  let parser = new UAParser();
  const device = parser.getDevice().model;
  if (memberid) {
    const msgToWrite =
      cardId != null
        ? { message: message, link: link ?? '', card: cardId }
        : { message: message };

    const { error } = await supabase.from('team_logs').insert([
      {
        data: msgToWrite,
        type: type,
        team_member: memberid,
        platform: device ?? 'Undetected Device',
        uniqueId: genId() ?? 0,
        team: teamId,
        card_holder: holder,
      },
    ]);

    if (error) console.log(error);
  }

  return 200;
};

// export default logDeleteMember;
