import supabase from '@lib/db';

export const createTeamMember = async (uid, input, company, tid, role) => {
  const { data, error } = await supabase.from('team_members').insert(
    {
      team_id: tid,
      uid: uid,
      role: role,
      team_profile: {
        firstname: input.fname,
        lastname: input.lname,
        job: '',
        avatar: '',
        design: {
          theme: 'black',
          background: '',
        },
        address: '',
        company: company ?? '',
        links: [
          {
            link: 'https://qubic.id',
            title: 'My Website',
            isActive: true,
          },
        ],
        socials: [
          {
            data: input.email,
            type: 'email',
            isActive: true,
          },
        ],
        isShowMetaImage: true,
      },
    },
    {
      returning: 'minimal',
    }
  );

  if (error) {
    console.log(error);
    return { error: true };
  } else {
    return { error: false };
  }
};

export const checkFirstRegisteredMember = async (tid) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('team_id', tid);

  if (error) console.log(error);
  if (data) {
    if (data.length < 1) {
      return true;
    } else {
      return false;
    }
  }
};

export const checkIsRegistered = async (uid) => {
  const { data, error } = await supabase.functions.invoke('getUserEmail', {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      uid: uid,
    }),
  });

  if (error) console.log(error);
  if (data) {
    if (data.user) {
      return false;
    } else {
      return true;
    }
  }
};

export const checkRegisteredMemberCount = async (tid, member_count) => {
  const { data, error, count } = await supabase
    .from('team_members')
    .select('id', { count: 'exact' })
    .eq('team_id', tid);

  if (error) {
    console.log(error);
    return { error: true };
  } else {
    if (count < member_count) {
      return { error: false, available: true };
    } else {
      return { error: false, available: false };
    }
  }
};
