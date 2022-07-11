import { getMemberId } from '@lib/query/getId';
import supabase from '@lib/db';

export const getConnectionsRecords = async (col, id) => {
  const { data, error } = await supabase
    .from('team_connection_acc')
    // .select('*')
    .select(
      'dateConnected, profileData->firstname, profileData->lastname, profileData->company, profileData->job, profileData->avatar, profileData->links, profileData->socials, message, link, by(team_profile->firstname, team_profile->lastname)'
    )
    .eq(col, id)
    .csv();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
};

export const getLogsRecords = async (col, id) => {
  const { data, error } = await supabase
    .from('team_logs')
    .select('*')
    .eq(col, id)
    .csv();
  if (error) {
    console.log(error);
  } else {
    return data;
  }
};
