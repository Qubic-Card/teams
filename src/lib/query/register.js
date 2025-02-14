import supabase from '@lib/db';

export const createTeamMember = async (uid, input, company, tid, role) => {
  const { data, error } = await supabase
    .from('team_members')
    .insert({
      team_id: tid,
      uid: uid,
      role: role,
      team_profile: {
        firstname: input.fname,
        lastname: input.lname,
        job: '',
        avatar: '',
        design: {
          theme: 'dark',
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
    })
    .select('*');

  if (error) {
    console.log(error);
    return { error: true, memberId: null };
  } else {
    return { error: false, memberId: data[0].id };
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
    body: {
      uid: uid,
    },
  });

  if (error) console.log(error);
  if (data) {
    console.log('data', data);
    if (data.user) {
      return false;
    } else {
      return true;
    }
  }
};

export const checkTeamMembers = async (tid, member_count) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id, uid')
    .eq('team_id', tid);

  if (error) {
    console.log(error);
    return { error: true };
  } else {
    if (data.length < member_count) {
      return {
        error: false,
        available: true,
      };
    } else {
      return { error: false, available: false };
    }
  }
};

export const checkAlreadyTeamMember = async (uid, tid) => {
  const { data, error } = await supabase
    .from('team_members')
    .select('id')
    .eq('uid', uid)
    .eq('team_id', tid);

  if (error) {
    return { error: true };
  } else {
    if (data.length > 0) {
      return { error: false, isMember: true };
    } else {
      return { error: false, isMember: false };
    }
  }
};

export const logMsg = (email) => {
  return `User ${email ?? ''} has joined the team`;
};

export const checkEmptyStringInObject = (obj) => {
  for (let key in obj) {
    if (obj[key] === '') {
      return true;
    }
  }
  return false;
};
