import supabase from '@lib/db';

export const checkIsActiveMember = async (uid) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('uid')
    .eq('uid', uid);

  if (error) console.log(error);
  if (data) {
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  }
};
