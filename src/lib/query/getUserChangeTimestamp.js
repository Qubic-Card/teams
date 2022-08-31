import supabase from '@lib/db';

export const getUserChangeTs = async (uid, teamId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('user_change')
    .eq('uid', uid)
    .eq('team_id', teamId);

  if (error) console.log(error);

  if (data) {
    return data[0]?.user_change;
  }
};
