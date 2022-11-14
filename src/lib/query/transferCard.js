import { toastFailed, toastSuccess } from '@lib/utils/toast';

import { selectedAddress } from '@lib/stores/subsEndStore';
import supabase from '@lib/db';

const uniqueByKeepFirst = (a, key) => {
  let seen = new Set();
  return a?.filter((item) => {
    let k = key(item);
    return seen.has(k) ? false : seen.add(k);
  });
};

const createCardConnection = async (card) => {
  const { data, error } = await supabase.from('card_connection').insert(
    {
      uid: card.member[0].uid,
      card_id: card.id,
    },
    { returning: 'minimal' }
  );

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

const updateCardConnection = async (card) => {
  const { data, error } = await supabase
    .from('card_connection')
    .update(
      { uid: card.member[0].uid },
      {
        returning: 'minimal',
      }
    )
    .eq('card_id', card.id);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const cardConnectionHandler = async (card) => {
  const { data, error } = await supabase
    .from('card_connection')
    .select('card_id, uid')
    .eq('card_id', card.id);

  if (data.length === 0) {
    await createCardConnection(card);
  } else {
    if (data[0].uid !== card.member[0].uid) {
      await updateCardConnection(card);
    }
  }
};

export const changeCardMode = async (cardId) => {
  const { data, error } = await supabase
    .from('business_cards')
    .update(
      {
        mode: 'basic',
        team_id: null,
      },
      { returning: 'minimal' }
    )
    .eq('id', cardId);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const deleteTeamCardCon = async (cardId) => {
  const { data, error } = await supabase
    .from('team_cardcon')
    .delete()
    .eq('card_id', cardId);

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

export const searchProfile = async (email) => {
  console.log(email);
  const { data, error } = await supabase
    .from('profile')
    .select('uid')
    .eq('email', email);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
    return false;
  }

  if (data) {
    if (data.length === 0) {
      toastFailed('Email not found');
      selectedAddress.set({
        choosen: 1,
        uid: '',
      });
    } else {
      toastSuccess('Email found');
      selectedAddress.set({
        choosen: 1,
        uid: data[0].uid,
      });
    }
  }
};
