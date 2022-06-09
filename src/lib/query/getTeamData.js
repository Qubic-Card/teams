import supabase from '@lib/db';
import { getTeamId } from '@lib/query/getId';

const getTeamData = async (uid) => {
  let teamId = await getTeamId(uid);
  const { data, error } = await supabase
    .from('teams')
    .select('name, metadata->logo')
    .eq('id', teamId);

  if (error) console.log(error);
  if (data) {
    return data[0];
  }
};

export default getTeamData;
