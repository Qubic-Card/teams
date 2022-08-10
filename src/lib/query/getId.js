import supabase from '@lib/db';

export const getProfileId = async (uid) => {
  const { data, error } = await supabase
    .from('profile')
    .select('id')
    .eq('uid', uid);

  if (error) console.log(error);
  if (data) {
    return data[0].id;
  }
};

export const getTeamId = async (uid) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('team_id')
    .eq('uid', uid);

  if (error) console.log(error);
  if (data) {
    return data[0].team_id;
  }
};

export const getMembersId = async (teamId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', teamId);

  if (error) console.log(error);
  if (data) {
    return data;
  }
};
