<script>
  import { setUserData, user, userData } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db';
  import { browser } from '$app/env';
  import getRoleMaps from '@lib/query/getRoleMaps';
  import { onMount } from 'svelte';

  let roleMaps = [];

  $user = supabase.auth.user();

  $: console.log('Auth Wrapper', $userData);

  onMount(async () => (roleMaps = await getRoleMaps($user.id)));

  const redirect = () => {
    if ($user && $page.url.pathname === '/') goto('/select-teams');
  };

  const redirectToLogin = () => {
    if (!$user && $page.url.pathname !== '/') goto('/');
  };

  $: if (browser) redirect();
  $: if (browser) redirectToLogin();

  supabase.auth.onAuthStateChange(async (event, session) => {
    // console.log('auth state change', event, session);
    if (event == 'SIGNED_IN') {
      // roleMaps = await getRoleMaps($user.id);
      setUserData(roleMaps);
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
