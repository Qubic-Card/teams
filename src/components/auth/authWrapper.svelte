<script context="module">
  import supabase from '@lib/db.js';
  export async function load(ctx) {
    if (!supabase.auth.user()) {
      return {
        // headers: {
        //   Location: '/',
        // },
        redirect: '/',
        status: 302,
      };
    }
    return {};
  }
</script>

<script>
  import { user, userData } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';

  let roleMaps = [];

  // const getRoleMaps = async () => {
  //   const { data, error } = await supabase
  //     .from('team_members')
  //     .select('role_maps')
  //     .eq('uid', $user.id);

  //   if (error) console.log(error);

  //   if (data) {
  //     return data[0].role_maps;
  //   }
  // };

  $user = supabase.auth.user();
  // $: console.log('wrap', $user);
  $: console.log(supabase.auth.user());
  $: console.log('user data', $userData);
  // $: console.log('wrap', $page);
  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('auth state change', event, session);
    if (event == 'SIGNED_IN') {
      await goto('/select-teams', { noscroll: true });
      // roleMaps = await getRoleMaps();
      userData.set(roleMaps);
      user.set(session.user);
    }
    if (event == 'TOKEN_REFRESHED') {
      user.set(session.user);
    }
    if (event == 'PASSWORD_RECOVERY') {
      user.set(null);
      await goto('/resetPassword' + '?reset=' + session.access_token, {
        noscroll: true,
      });
    }
    if (event == 'SIGNED_OUT') {
      user.set(null);
      await goto('/', { noscroll: true });
    } else {
      user.set(null);
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
