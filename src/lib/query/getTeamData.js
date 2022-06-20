import supabase from '@lib/db';
import { getTeamId } from '@lib/query/getId';

const getTeamData = async (teamId) => {
  // let teamId = await getTeamId(uid);
  // console.log(teamId);
  const { data, error } = await supabase
    .from('teams')
    .select('name, metadata->logo, id')
    .eq('id', teamId);

  if (error) console.log(error);
  if (data) {
    return data[0];
  }
};

export default getTeamData;
