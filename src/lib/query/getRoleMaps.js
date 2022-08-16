import supabase from '@lib/db';

export const getRoleMapsByProfile = async (uid, teamId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('role(*),id, team_profile')
    .eq('uid', uid)
    .eq('team_id', teamId);

  if (error) console.log(error);

  if (data) {
    return data[0];
  }
};

export const getAllRoleByTeam = async (teamId) => {
  const { data, error } = await supabase
    .from('team_roles')
    .select('role_name, id')
    .eq('team_id', teamId)
    .order('created_at', { ascending: true });

  if (error) console.log(error);

  if (data) {
    return data;
  }
};

export const getMemberRole = async (uid, teamId) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('role(role_name, id)')
    .eq('uid', uid)
    .eq('team_id', teamId);

  if (error) console.log(error);

  if (data) {
    return data[0].role;
  }
};
