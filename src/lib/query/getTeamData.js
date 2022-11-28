import supabase from '@lib/db';

const getTeamData = async (teamId) => {
  const { data, error } = await supabase
    .from('teams')
    .select('name, metadata->logo, id, subscription_end_date, member_count')
    .eq('id', teamId);

  if (error) console.log(error);
  if (data) {
    return data[0];
  }
};

export default getTeamData;
