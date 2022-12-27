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

const createCardConnection = async (card, uid) => {
  // console.log('createCardConnection', uid !== '' ? uid : card.uid);
  const { data, error } = await supabase
    .from('card_connection')
    .insert({
      uid: uid !== '' ? uid : card.uid,
      card_id: card.id,
    })
    .select();

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

const updateCardConnection = async (card, uid) => {
  const { data, error } = await supabase
    .from('card_connection')
    .update({ uid: uid !== '' ? uid : card.uid })
    .eq('card_id', card.id);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const cardConnectionHandler = async (card, uid) => {
  const { data, error } = await supabase
    .from('card_connection')
    .select('card_id, uid')
    .eq('card_id', card.id);

  if (data.length === 0) {
    await createCardConnection(card, uid);
  } else {
    if (uid) {
      if (data[0].uid !== uid) {
        await updateCardConnection(card, uid);
      }
    } else {
      if (data[0].uid !== card.uid) {
        await updateCardConnection(card, '');
      }
    }
  }
};

export const changeCardMode = async (cardId) => {
  const { data, error } = await supabase
    .from('business_cards')
    .update({
      mode: 'basic',
      team_id: null,
    })
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
    .update({
      uid: member.uid,
      metadata: {
        avatar: member.team_profile.avatar,
        address: member.team_profile.address,
        company: member.team_profile.company,
        design: member.team_profile.design,
        firstname: member.team_profile.firstname,
        lastname: member.team_profile.lastname,
        job: member.team_profile.job,
        isShowMetaImage: member.team_profile.isShowMetaImage,
        socials: uniqueByKeepFirst(
          member.team_profile.socials,
          (social) => social.type
        ),
        links: member.team_profile.links,
      },
    })
    .eq('uid', member.uid);

  if (error) {
    console.log(error);
    toastFailed('Something went wrong, please contact us');
  }
};

export const searchProfile = async (email) => {
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
      selectedAddress.set({
        choosen: 1,
        uid: '',
      });
    } else {
      selectedAddress.set({
        choosen: 1,
        uid: data[0].uid,
      });
    }
  }
};
