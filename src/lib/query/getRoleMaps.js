import supabase from '@lib/db';

const getRoleMaps = async (uid) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('role(*)')
    .eq('uid', uid);

  if (error) console.log(error);

  if (data) {
    return data[0].role.role_maps;
  }
};

export default getRoleMaps;
