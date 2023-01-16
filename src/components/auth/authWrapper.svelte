<script>
  import { user } from '@lib/stores/userStore';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import supabase from '@lib/db.js';
  import { browser } from '$app/environment';
  import { cards } from '@lib/stores/cardsStore';
  import Cookies from 'js-cookie';
  import { checkIsActiveMember } from '@lib/query/checkIsActiveMember';
  import { onMount } from 'svelte';

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();
    $user = data.user;
  };

  onMount(async () => {
    await getUser();
  });

  const redirect = async () => {
    if ($page?.route.id.includes('(team)')) {
      if (!(await checkIsActiveMember($user?.id))) {
        $user = null;
      }
      if (!$user?.email_confirmed_at) {
        $user = null;
        goto('/');
      }
      if (!$user) goto('/');
    }

    if ($page?.route.id?.includes('(basic)')) {
      if (!$user) goto('/');
      if (!$user?.email_confirmed_at) {
        $user = null;
        goto('/');
      }
    }
  };

  $: if (browser) redirect();
  // $: getUser();

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == 'SIGNED_IN') {
      const { data } = await supabase.auth.getUser();
      $user = data.user;
    }
    if (event == 'TOKEN_REFRESHED') {
      const { data } = await supabase.auth.getUser();
      $user = data.user;
    }
    if (event == 'PASSWORD_RECOVERY') {
      $user = null;
      await goto('/resetPassword' + '?reset=' + session.access_token, {
        noScroll: true,
      });
    }
    if (event == 'SIGNED_OUT') {
      $user = null;
      $cards = Cookies.get('card');
      Cookies.remove('card');
      await goto('/', { noScroll: true });
    }
  });
</script>

<div class="w-full">
  <slot />
</div>
