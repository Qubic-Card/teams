import supabase from '@lib/db';
import { toastFailed } from '@lib/utils/toast';

const uniqueByKeepFirst = (a, key) => {
  let seen = new Set();
  return a?.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
};

export const createCardConnection = async (member) => {
  const { data, error } = await supabase.from('card_connection').insert(
    {
      uid: member.member[0].uid,
      card_id: member.id,
    },
    { returning: 'minimal' }
  );

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const cardConnectionHandler = async (member) => {
  const { data, error } = await supabase
    .from('card_connection')
    .select('card_id, uid')
    .eq('card_id', member.id);

  if (data.length === 0) {
    await createCardConnection(member);
  }
};

export const changeCardMode = async (cardId) => {
  const { data, error } = await supabase
    .from('business_cards')
    .update(
      {
        mode: 'basic',
      },
      { returning: 'minimal' }
    )
    .eq('id', cardId);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const setNullTeamMemberUid = async (id) => {
  const { data, error } = await supabase
    .from('team_members')
    .update(
      {
        uid: null,
      },
      { returning: 'minimal' }
    )
    .eq('id', id);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const updateBasicProfile = async (member) => {
  const { data, error } = await supabase
    .from('profile')
    .update(
      {
        uid: member.member[0].uid,
        metadata: {
          avatar: member.member[0].team_profile.avatar,
          address: member.member[0].team_profile.address,
          company: member.member[0].team_profile.company,
          design: member.member[0].team_profile.design,
          firstname: member.member[0].team_profile.firstname,
          lastname: member.member[0].team_profile.lastname,
          job: member.member[0].team_profile.job,
          isShowMetaImage: member.member[0].team_profile.isShowMetaImage,
          socials: uniqueByKeepFirst(
            member.member[0].team_profile.socials,
            (social) => social.type
          ),
          links: member.member[0].team_profile.links,
        },
      },
      { returning: 'minimal' }
    )
    .eq('uid', member.member[0].uid);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};
