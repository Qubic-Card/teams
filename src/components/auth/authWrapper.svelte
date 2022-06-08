<script>
  import { user, userData } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';

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
  $: console.log('user data', $page.url.pathname);
  $: redirect()
  $: redirectToLogin()
  // $: console.log('wrap', $page);
  const redirect = () => {
    if($user && $page.url.pathname === '/')
    goto('/select-teams');
  }

  const redirectToLogin = () => {
    if(!$user && $page.url.pathname !== '/')
    goto('/');
  }

  supabase.auth.onAuthStateChange(async (event, session) => {
    console.log('auth state change', event, session);
    if (event == 'SIGNED_IN') {
      // userData.set(roleMaps);
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
